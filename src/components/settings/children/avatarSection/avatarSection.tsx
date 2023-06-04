import { ChangeEvent, useContext, useState } from "react";

import { Icons } from "@/components";
import { Avatar } from "@/components/stage/children";
import { SettingsContext } from "@/state";

const blankLayer = {
  id: 0,
  name: "",
  path: "",
  talking: "",
  thinking: "",
  blinking: "",
  altPose1: "",
  altPose2: "",
  default: "",
};

export const AvatarSection = () => {
  const context = useContext(SettingsContext)!;
  const { settings, setField, setLayerField } = context;
  const { avatar } = settings;
  const { layers } = avatar;
  const [previewMode, setPreviewMode] = useState("0");

  const handleAddLayerClick = () => {
    let newLayer = { ...blankLayer };
    newLayer.id = new Date().getTime();
    setField("avatar", "layers", [...layers, newLayer]);
  };

  const handleChangeField = (e: ChangeEvent<HTMLInputElement>) => {
    setField("avatar", e.target.name, e.target.value);
  };

  const handleChangeLayerField = (e: ChangeEvent<HTMLInputElement>) => {
    const [name, index] = e.target.name.split("_");
    setLayerField(parseInt(index), name, e.target.value);
  };

  const handleDeleteLayer = (id: number | string) => {
    if (
      window.confirm(
        `Are you sure you want to delete this layer? This action cannot be undone.`
      )
    ) {
      const newLayers = layers.filter((l) => l.id !== id);
      setField("avatar", "layers", newLayers);
    }
  };

  const handleMoveLayer = (id: number | string, direction: "up" | "down") => {
    const newLayers = [...layers];
    const index = newLayers.findIndex((item) => item.id === id);
    if (index === -1) {
      console.log("Item not found in the array.");
      return newLayers; // No changes needed
    }
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newLayers.length) {
      console.log("Cannot move item further in the specified direction.");
      return newLayers; // No changes needed
    }
    const updatedArray = [...newLayers];
    const itemToMove = updatedArray[index];
    updatedArray[index] = updatedArray[newIndex];
    updatedArray[newIndex] = itemToMove;
    setField("avatar", "layers", updatedArray);
  };

  return (
    <fieldset>
      <legend>Avatar</legend>
      <div className="row">
        <div className="col-6 mb-3">
          <div className="mb-3">
            <label className="form-label">Background Color</label>
            <p className="tip">
              Background color (as a{" "}
              <a href="https://htmlcolorcodes.com/" target="_blank">
                hex code
              </a>
              ) behind layers to use with streaming software chroma key.
            </p>
            <div className="row">
              <div className="col-3">
                <input
                  type="text"
                  className="form-control"
                  name="bgColor"
                  placeholder="00FF00"
                  value={avatar.bgColor}
                  onChange={handleChangeField}
                />
              </div>
              <div className="col-3 ps-0 ">
                <div
                  className="d-inline-block sample-color rounded"
                  style={{ background: `#${avatar.bgColor}` }}
                >
                  &nbsp;
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="form-label">Preview</label>
            <select
              className="form-select"
              value={previewMode}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setPreviewMode(e.target.value);
              }}
            >
              <option value="0">
                Idle (Will blink and shift to alt poses at random intervals)
              </option>
              <option value="1">
                Talking (Will toggle between default and talking images)
              </option>
            </select>
          </div>
        </div>
        <div className="col-6 mb-3">
          <Avatar overrideTalking={previewMode === "1"} />
        </div>
        {layers.map((layer, index) => {
          return (
            <div className="col-12 mb-3" key={layer.id}>
              <div className="row border rounded pt-2 mx-0 layer-row border-warning-subtle position-relative">
                <div className="col-2 mb-3">
                  <button
                    type="button"
                    className="btn btn-primary bg-gradient me-2"
                    onClick={() => handleMoveLayer(layer.id, "up")}
                  >
                    <Icons.ArrowBarUp />
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary bg-gradient me-2"
                    onClick={() => handleMoveLayer(layer.id, "down")}
                  >
                    <Icons.ArrowBarDown />
                  </button>
                </div>
                <div className="col-3 mb-3">
                  <label className="form-label">Name</label>
                  <p className="tip">The name of the layer.</p>
                  <input
                    type="text"
                    className="form-control"
                    name={`name_${index}`}
                    placeholder="e.g. Face"
                    value={layer.name}
                    onChange={handleChangeLayerField}
                  />
                </div>
                <div className="col-7 mb-3">
                  <label className="form-label">Path</label>
                  <p className="tip">
                    (Required) The path to the directory inside the repo&apos;s
                    /public/ directory that this layer&apos;s files are inside.
                    Include trailing /.
                  </p>
                  <input
                    type="text"
                    className="form-control"
                    name={`path_${index}`}
                    placeholder="eg. puppet_images/"
                    style={{ width: "66%" }}
                    value={layer.path}
                    onChange={handleChangeLayerField}
                  />
                </div>
                <div className="col-4 mb-3">
                  <label className="form-label">Talking</label>
                  <p className="tip">
                    Alternates w/default image when mouth opens while talking.
                  </p>
                  <input
                    type="text"
                    className="form-control"
                    name={`talking_${index}`}
                    placeholder="eg. mouth_open.png"
                    value={layer.talking}
                    onChange={handleChangeLayerField}
                  />
                </div>
                <div className="col-4 mb-3">
                  <label className="form-label">Thinking</label>
                  <p className="tip">
                    Triggered when puppet is waiting for response from OpenAI
                    API.
                  </p>
                  <input
                    type="text"
                    className="form-control"
                    name={`thinking_${index}`}
                    placeholder="eg. thinking.png"
                    value={layer.thinking}
                    onChange={handleChangeLayerField}
                  />
                </div>
                <div className="col-4 mb-3">
                  <label className="form-label">Blinking</label>
                  <p className="tip">Triggered when puppet blinks.</p>
                  <input
                    type="text"
                    className="form-control"
                    name={`blinking_${index}`}
                    placeholder="eg. blink.png"
                    value={layer.blinking}
                    onChange={handleChangeLayerField}
                  />
                </div>
                <div className="col-4 mb-3">
                  <label className="form-label">Alt Pose 1</label>
                  <p className="tip">
                    Triggered every so often for a few seconds to
                    shift/twitch/look around.
                  </p>
                  <input
                    type="text"
                    className="form-control"
                    name={`altPose1_${index}`}
                    placeholder="eg. lookleft.png"
                    value={layer.altPose1}
                    onChange={handleChangeLayerField}
                  />
                </div>
                <div className="col-4 mb-3">
                  <label className="form-label">Alt Pose 2</label>
                  <p className="tip">
                    Triggered every so often for a few seconds to
                    shift/twitch/look around.
                  </p>
                  <input
                    type="text"
                    className="form-control"
                    name={`altPose2_${index}`}
                    placeholder="eg. lookright.png"
                    value={layer.altPose2}
                    onChange={handleChangeLayerField}
                  />
                </div>
                <div className="col-4 mb-3">
                  <label className="form-label">Default (Required)</label>
                  <p className="tip">The default to show when not talking.</p>
                  <input
                    type="text"
                    className="form-control"
                    name={`default_${index}`}
                    placeholder="eg. default.png"
                    value={layer.default}
                    onChange={handleChangeLayerField}
                  />
                </div>
                {avatar.layers.length > 1 && (
                  <div className="position-absolute delete-layer">
                    <button
                      type="button"
                      className="btn btn-danger bg-gradient"
                      title="Delete Layer"
                      onClick={() => handleDeleteLayer(layer.id)}
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className="col-12 mb-3">
          <button
            type="button"
            className="btn btn-primary bg-gradient"
            onClick={handleAddLayerClick}
          >
            Add New Layer
          </button>
        </div>
        <div className="col-12">
          <div className="alert alert-warning" role="alert">
            <p className="fs-7 mb-0 text-tip-yellow">
              The URLs for each layer image should be relative to the /public/
              directory in your code repository. For example, if you have a
              layer image in /public/images/layer.png, the URL would be
              /images/layer.png. The layer images should be PNGs with
              transparent backgrounds if using multiple layers. Each layer must
              have at least a Talking and Base image. The other images are
              optional. The one earliest in the list that applies will be used.
              The higher in the list a layer is, the higher its z-index will be
              in the final image.
            </p>
          </div>
        </div>
      </div>
    </fieldset>
  );
};
