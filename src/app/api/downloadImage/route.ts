import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const imageUrl = req.nextUrl.searchParams.get("url");
        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
        }

        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch image");
        }

        const imageBuffer = await response.arrayBuffer();

        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                "Content-Type": "image/png",
                "Content-Disposition": 'attachment; filename="download.png"',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to download image" }, { status: 500 });
    }
}
