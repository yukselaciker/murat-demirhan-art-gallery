import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// Tüm eserleri getir
export async function GET() {
    const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("GET /api/artworks error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
}

// Yeni eser ekle
export async function POST(req: Request) {
    const body = await req.json();
    const { title, year, technique, size, imageUrl, category, description, status } = body;

    // Handle image field alias (image / imageUrl / image_url)
    const finalImageUrl = body.image_url || imageUrl || body.image;

    const { data, error } = await supabase.from("artworks").insert([
        {
            title,
            year,
            technique,
            size,
            image_url: finalImageUrl,
            category,
            description,
            status
        },
    ]);

    if (error) {
        console.error("POST /api/artworks error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}

// Eser sil
export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "id parametresi gerekli" }, { status: 400 });
    }

    const { error } = await supabase.from("artworks").delete().eq("id", id);

    if (error) {
        console.error("DELETE /api/artworks error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}
