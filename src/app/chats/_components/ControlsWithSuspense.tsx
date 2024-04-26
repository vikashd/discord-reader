import { getMessages } from "@/app/_actions/getMessages";
import { ControlExtras } from "./ControlExtras";

interface ControlsWithSuspenseProps {
  channel: string;
  page: string;
}

export async function ControlsWithSuspense({
  channel,
  page,
}: ControlsWithSuspenseProps) {
  const response = await getMessages(channel, page);

  const {
    data: [data],
  } = response;

  return <ControlExtras messages={data} />;
}
