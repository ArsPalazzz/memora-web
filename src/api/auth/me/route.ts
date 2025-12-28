import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get(
      "https://memora-api-production.up.railway.app/auth/me",
      {
        headers: {
          Cookie: req.headers.cookie,
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (e: unknown) {
    res
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .status((e as any).response?.status || 500)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .json({ message: (e as any).message });
  }
}
