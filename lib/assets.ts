const ASSETS = {
    playerIcons: {
        "Baby Luigi": "/assets/Characters/Baby Luigi.png",
        "Baby Mario": "/assets/Characters/Baby Mario.png",
        "Birdo": "/assets/Characters/Birdo.png",
        "Boo": "/assets/Characters/Boo.png",
        "Bowser": "/assets/Characters/Bowser.png",
        "Bowser Jr.": "/assets/Characters/Bowser Jr.png",
        "Bro(B)": "/assets/Characters/Bro(B).png",
        "Bro(F)": "/assets/Characters/Bro(F).png",
        "Bro(H)": "/assets/Characters/Bro(H).png",
        "Daisy": "/assets/Characters/Daisy.png",
        "Diddy": "/assets/Characters/Diddy.png",
        "Dixie": "/assets/Characters/Dixie.png",
        "DK": "/assets/Characters/DK.png",
        "Dry Bones(B)": "/assets/Characters/Dry Bones(B).png",
        "Dry Bones(G)": "/assets/Characters/Dry Bones(G).png",
        "Dry Bones(Gy)": "/assets/Characters/Dry Bones(Gy).png",
        "Dry Bones(R)": "/assets/Characters/Dry Bones(R).png",
        "Goomba": "/assets/Characters/Goomba.png",
        "King Boo": "/assets/Characters/King Boo.png",
        "Koopa(G)": "/assets/Characters/Koopa(G).png",
        "Koopa(R)": "/assets/Characters/Koopa(R).png",
        "Luigi": "/assets/Characters/Luigi.png",
        "Magikoopa(B)": "/assets/Characters/Magikoopa(B).png",
        "Magikoopa(G)": "/assets/Characters/Magikoopa(G).png",
        "Magikoopa(R)": "/assets/Characters/Magikoopa(R).png",
        "Magikoopa(Y)": "/assets/Characters/Magikoopa(Y).png",
        "Mario": "/assets/Characters/Mario.png",
        "Monty": "/assets/Characters/Monty.png",
        "Noki(B)": "/assets/Characters/Noki(B).png",
        "Noki(G)": "/assets/Characters/Noki(G).png",
        "Noki(R)": "/assets/Characters/Noki(R).png",
        "Paragoomba": "/assets/Characters/Paragoomba.png",
        "Paratroopa(G)": "/assets/Characters/Paratroopa(G).png",
        "Paratroopa(R)": "/assets/Characters/Paratroopa(R).png",
        "Peach": "/assets/Characters/Peach.png",
        "Petey": "/assets/Characters/Petey.png",
        "Pianta(B)": "/assets/Characters/Pianta(B).png",
        "Pianta(R)": "/assets/Characters/Pianta(R).png",
        "Pianta(Y)": "/assets/Characters/Pianta(Y).png",
        "Shy Guy(B)": "/assets/Characters/Shy Guy(B).png",
        "Shy Guy(Bk)": "/assets/Characters/Shy Guy(Bk).png",
        "Shy Guy(G)": "/assets/Characters/Shy Guy(G).png",
        "Shy Guy(R)": "/assets/Characters/Shy Guy(R).png",
        "Shy Guy(Y)": "/assets/Characters/Shy Guy(Y).png",
        "Toad(B)": "/assets/Characters/Toad(B).png",
        "Toad(G)": "/assets/Characters/Toad(G).png",
        "Toad(P)": "/assets/Characters/Toad(P).png",
        "Toad(R)": "/assets/Characters/Toad(R).png",
        "Toad(Y)": "/assets/Characters/Toad(Y).png",
        "Toadette": "/assets/Characters/Toadette.png",
        "Toadsworth": "/assets/Characters/Toadsworth.png",
        "Waluigi": "/assets/Characters/Waluigi.png",
        "Wario": "/assets/Characters/Wario.png",
        "Yoshi": "/assets/Characters/Yoshi.png"
    },
    jerseyIcons: {
        "Andy's Fandys": "/assets/Jerseys/andy-fandys-jersey.webp",
        "Vswed Bombers": "/assets/Jerseys/bombers-jersey.webp",
        "CJYA Monkeys": "/assets/Jerseys/cjya-monkeys-jersey.webp",
        "DGR Dingers": "/assets/Jerseys/dgr-dingers-jersey.webp",
        "FIR Golf Rules": "/assets/Jerseys/golf-rules-jersey.webp",
        "Lightorious Swingers": "/assets/Jerseys/lightorias-swingers-jersey.webp",
        "Moarf23 Lobsters": "/assets/Jerseys/moarf23-lobsters-jersey.webp",
        "Oogy Gooners": "/assets/Jerseys/oogy-gooners-jersey.webp",
        "Phillie Cheesesteaks": "/assets/Jerseys/phillie-cheesesteaks-jersey.webp",
        "Virgins": "/assets/Jerseys/virgins-jersey.webp",
        "Wishlist Curiousity BC": "/assets/Jerseys/wc-jersey.webp",
        "Wet Blankets": "/assets/Jerseys/wet-blankets-jersey.webp"
    }
}


export function getPlayerIcon(name: string): string | null {
    return ASSETS.playerIcons[name as keyof typeof ASSETS.playerIcons];
}

export function getJerseyIcon(name: string): string | null {
    return ASSETS.jerseyIcons[name as keyof typeof ASSETS.jerseyIcons];
}
