import { getMessages } from "@/app/_actions/getMessages";
import { ControlExtras } from "./ControlExtras";

interface ControlsWithSuspenseProps {
  channel: string;
  page: string;
  query?: string;
}

export async function ControlsWithSuspense({
  channel,
  page,
  query,
}: ControlsWithSuspenseProps) {
  const response = await getMessages({ channel, page, query });

  const { data } = response;

  return <ControlExtras messages={data} />;
}
