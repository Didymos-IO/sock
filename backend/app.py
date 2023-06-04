from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from TTS.api import TTS

import base64
import calendar
import flask
import json
import openai
import os
import sys
import tempfile
import tiktoken
import time
import torch
import whisper

load_dotenv()
app = flask.Flask(__name__)
CORS(app)

TTS_USE_GPU = os.getenv("TTS_USE_GPU") == "True"
# OpenAI API Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_CHAT_MODEL = os.getenv("OPENAI_CHAT_MODEL")
openai.api_key = OPENAI_API_KEY

POST_ONLY_ERROR = "This endpoint only processes POST requests"

print("use GPU: ", TTS_USE_GPU)

# --------------------------------------------------------------------------- #
# --------------------------- Helper Functions ------------------------------ #
# --------------------------------------------------------------------------- #

class _SuppressTTSLogs:
    """
    Suppresses print statements (Coqui-AI gets noisy)
    From: https://stackoverflow.com/a/45669280/7543474
    Licensed under CC BY-SA 4.0
    """

    def __enter__(self):
        self._original_stdout = sys.stdout
        sys.stdout = open(os.devnull, "w")

    def __exit__(self, exc_type, exc_val, exc_tb):
        sys.stdout.close()
        sys.stdout = self._original_stdout

def dry_fire_initial_tts():
    """
    We want to fire the TTS engine once on startup to avoid the delay on the first request.
    """
    with _SuppressTTSLogs():
        tts = TTS("tts_models/en/vctk/vits", progress_bar=True, gpu=TTS_USE_GPU)
        tts.tts_to_file(
            "Just a moment while I load my neural network.",
            speaker="p229",
            emotion="Neutral",
            speed=1.0,
            file_path="speech_outputs/initial_tts.wav"
        )

# --------------------------------------------------------------------------- #
# ----------------------------- API Endpoints ------------------------------- #
# --------------------------------------------------------------------------- #

@app.route("/chat", methods=["POST"])
def chat():
    if request.method == "POST":
        data = request.get_json()
        messages = data["messages"]
        temperature = data["temperature"]
        frequency_penalty = data["frequency_penalty"]
        presence_penalty = data["presence_penalty"]
        max_tokens = data["max_tokens"]
        response = openai.ChatCompletion.create(
            model=OPENAI_CHAT_MODEL, messages=messages, temperature=temperature, frequency_penalty=frequency_penalty, presence_penalty=presence_penalty, max_tokens=max_tokens
        )
        return response
    else:
        return POST_ONLY_ERROR

@app.route("/count-tokens", methods=["POST"])
def count_tokens():
    if request.method == "POST":
        data = request.get_json()
        messages = data["messages"]
        model = "gpt-3.5-turbo-0301"
        try:
            encoding = tiktoken.encoding_for_model(model)
        except KeyError:
            encoding = tiktoken.get_encoding("cl100k_base")
        num_tokens = 0
        for message in messages:
            num_tokens += (
                4  # every message follows <im_start>{role/name}\n{content}<im_end>\n
            )
            for key, value in message.items():
                num_tokens += len(encoding.encode(value))
                if key == "name":  # if there's a name, the role is omitted
                    num_tokens += -1  # role is always required and always 1 token
        num_tokens += 2  # every reply is primed with <im_start>assistant
        return json.dumps({"result": num_tokens})
    else:
        return POST_ONLY_ERROR

@app.route("/get_speakers", methods=["POST"])
def get_speakers():
    if request.method == "POST":
        data = request.get_json()
        model = data["model"]
        tts = TTS(model, progress_bar=True, gpu=True)
        return jsonify({"speakers": tts.speakers})
    else:
        return POST_ONLY_ERROR

@app.route("/load_config", methods=["POST"])
def load_config():
    try:
        with open('config/config.json', 'r') as file:
            config = json.load(file)
    except FileNotFoundError:
        return {"error": "Config file not found"}, 404
    except json.JSONDecodeError:
        return {"error": "Error reading config file"}, 500
    return jsonify({"config": config})

@app.route("/save_config", methods=["POST"])
def save_config():
    data = request.get_json()
    config = data["config"]
    if not config:
        return {"error": "No config received"}, 400
    try:
        data = json.loads(config)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON"}, 400
    json_str = json.dumps(data, indent=4)
    with open('config/config.json', 'w') as file:
        file.write(json_str)
    return {"message": "Config saved successfully"}, 200

@app.route("/transcribe", methods=["POST"])
def transcribe():
    if request.method == "POST":
        language = request.form["language"]
        model = request.form["model_size"]

        # there are no english models for large
        if model != "large" and language == "english":
            model = model + ".en"
        audio_model = whisper.load_model(model)

        temp_dir = tempfile.mkdtemp()
        save_path = os.path.join(temp_dir, "temp.wav")

        wav_file = request.files["audio_data"]
        wav_file.save(save_path)

        if language == "english":
            result = audio_model.transcribe(save_path, language="english")
        else:
            result = audio_model.transcribe(save_path)

        return result["text"]
    else:
        return "This endpoint only processes POST wav blob"

@app.route("/tts_coqui", methods=["POST"])
def tts_coqui():
    if request.method == "POST":
        data = request.get_json()
        text = data.get("text", "")
        model = data.get("model", "tts_models/en/vctk/vits")
        speaker = data.get("speaker", "p229")
        emotion = data.get("emotion", "Neutral")
        speed = data.get("speed", 1.0)
        language = data.get("language", None)

        print('tts_coqui:', text, model, language, speaker, emotion, speed, language)
        with _SuppressTTSLogs():
            gmt = time.gmtime()
            ts = calendar.timegm(gmt)
            file_name = f"speech_outputs/so_{ts}.wav"

            tts = TTS(model, progress_bar=True, gpu=True)
            tts.tts_to_file(
                text,
                speaker=speaker,
                language=language,
                emotion=emotion,
                speed=speed,
                file_path=file_name
            )

            with open(file_name, "rb") as file:
                wav_data = file.read()

            base64_url = base64.b64encode(wav_data).decode("utf-8")
            os.remove(file_name)

        return jsonify(audioUrl=base64_url)            

    else:
        return POST_ONLY_ERROR


# ------------------------------- On Load ----------------------------------- # 

dry_fire_initial_tts()
