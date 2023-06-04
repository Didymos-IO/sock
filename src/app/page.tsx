/* eslint-disable react/display-name */
import dynamic from "next/dynamic";

const DynamicCore = dynamic(() => import("../components/core/core") as any, {
  loading: () => <div></div>,
  ssr: false,
});

export default function Home() {
  return <DynamicCore />;
}
