import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import PinataSDK from "@pinata/sdk"
import { Readable } from "stream"

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJWTKey: process.env.PINATA_JWT || "",
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert File to Buffer and create a Readable stream
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const stream = Readable.from(buffer)

    // Upload stream to Pinata
    const response = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: {
        name: file.name,
      }
    })
    
    return NextResponse.json({ 
      IpfsHash: response.IpfsHash,
      PinSize: response.PinSize,
      Timestamp: response.Timestamp
    }, { status: 200 })
  } catch (error) {
    console.error("Upload to Pinata failed:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    )
  }
}