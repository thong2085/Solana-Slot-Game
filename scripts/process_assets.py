import os
from PIL import Image, ImageDraw

SRC_DIR = '/Applications/XAMPP/xamppfiles/htdocs/Solana-Slot-Game/img'
SYMBOLS_DIR = '/Applications/XAMPP/xamppfiles/htdocs/Solana-Slot-Game/client/public/assets/symbols'
UI_DIR = '/Applications/XAMPP/xamppfiles/htdocs/Solana-Slot-Game/client/public/assets/ui'

def bfs_clean(img, seeds, is_bg_func):
    img = img.convert('RGBA')
    w, h = img.size
    pixels = img.load()
    visited = set(seeds)
    queue = list(seeds)
    head = 0
    while head < len(queue):
        cx, cy = queue[head]
        head += 1
        pixels[cx, cy] = (0, 0, 0, 0)
        for nx, ny in ((cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)):
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                if is_bg_func(nx, ny):
                    visited.add((nx, ny))
                    queue.append((nx, ny))
    return img

def get_border_seeds(w, h, is_bg_func):
    seeds = []
    for x in range(w):
        if is_bg_func(x, 0): seeds.append((x, 0))
        if is_bg_func(x, h - 1): seeds.append((x, h - 1))
    for y in range(h):
        if is_bg_func(0, y): seeds.append((0, y))
        if is_bg_func(w - 1, y): seeds.append((w - 1, y))
    return seeds

def normalize_canvas(img, target_size=(256, 256)):
    bbox = img.getbbox()
    if bbox:
        x1, y1, x2, y2 = bbox
        x1 = max(0, x1 - 2)
        y1 = max(0, y1 - 2)
        x2 = min(img.width, x2 + 2)
        y2 = min(img.height, y2 + 2)
        img = img.crop((x1, y1, x2, y2))
    img.thumbnail(target_size, Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', target_size, (0, 0, 0, 0))
    offset = ((target_size[0] - img.width) // 2, (target_size[1] - img.height) // 2)
    canvas.paste(img, offset)
    return canvas

def process_mid_and_special():
    mid = Image.open(os.path.join(SRC_DIR, 'lucid-origin_set_of_4_mid-pay_slot_game_symbols_golden_scarab_beetle_with_wings_ankh_cross_wi-0.jpg'))
    sp = Image.open(os.path.join(SRC_DIR, 'gpt-image-2_set_of_2_special_slot_symbols_Scatter_symbol_as_a_glowing_ancient_magic_book_wit-0.jpg'))

    # 1. Ankh (clean drop shadow and center loop hole)
    ankh_crop = mid.crop((550, 30, 920, 480))
    ankh_hsv = ankh_crop.convert('HSV')
    w, h = ankh_crop.size
    def ankh_bg(x, y):
        H, S, V = ankh_hsv.getpixel((x, y))
        return (S < 90) or (S < 135 and V < 165)
    seeds = get_border_seeds(w, h, ankh_bg)
    seeds.append((w // 2, 115))
    ankh_res = normalize_canvas(bfs_clean(ankh_crop, seeds, ankh_bg))
    ankh_res.save(os.path.join(SYMBOLS_DIR, 'ankh.png'))

    # 2. Eye of Horus (clean drop shadow and lower spiral loop)
    eye_crop = mid.crop((35, 545, 485, 925))
    eye_hsv = eye_crop.convert('HSV')
    w, h = eye_crop.size
    def eye_bg(x, y):
        H, S, V = eye_hsv.getpixel((x, y))
        return (S < 90) or (S < 135 and V < 170)
    seeds = get_border_seeds(w, h, eye_bg)
    seeds.append((120, 280))
    eye_res = normalize_canvas(bfs_clean(eye_crop, seeds, eye_bg))
    eye_res.save(os.path.join(SYMBOLS_DIR, 'eye.png'))

    # 3. Scarab (clean wing fringes and antenna drop shadow)
    scarab_crop = mid.crop((20, 45, 505, 455))
    scarab_hsv = scarab_crop.convert('HSV')
    w, h = scarab_crop.size
    def scarab_bg(x, y):
        H, S, V = scarab_hsv.getpixel((x, y))
        return (S < 85) or (S < 130 and V < 165)
    seeds = get_border_seeds(w, h, scarab_bg)
    scarab_res = normalize_canvas(bfs_clean(scarab_crop, seeds, scarab_bg))
    scarab_res.save(os.path.join(SYMBOLS_DIR, 'scarab.png'))

    # 4. Scepter (clean staff drop shadow)
    scepter_crop = mid.crop((560, 500, 910, 980))
    scepter_hsv = scepter_crop.convert('HSV')
    w, h = scepter_crop.size
    def scepter_bg(x, y):
        H, S, V = scepter_hsv.getpixel((x, y))
        return (S < 90) or (S < 135 and V < 165)
    seeds = get_border_seeds(w, h, scepter_bg)
    scepter_res = normalize_canvas(bfs_clean(scepter_crop, seeds, scepter_bg))
    scepter_res.save(os.path.join(SYMBOLS_DIR, 'scepter.png'))

    # 5. Scatter Book (crop with top margin for fire aura, clean white aura)
    scatter_crop = sp.crop((15, 110, 475, 840))
    scatter_hsv = scatter_crop.convert('HSV')
    w, h = scatter_crop.size
    def scatter_bg(x, y):
        H, S, V = scatter_hsv.getpixel((x, y))
        return (V > 230 and S < 75) or (S < 50)
    seeds = get_border_seeds(w, h, scatter_bg)
    seeds.append((175, 530))
    scatter_res = normalize_canvas(bfs_clean(scatter_crop, seeds, scatter_bg))
    scatter_res.save(os.path.join(SYMBOLS_DIR, 'scatter.png'))

    # 6. Wild Sun (clean flames aura)
    wild_crop = sp.crop((510, 110, 990, 840))
    wild_hsv = wild_crop.convert('HSV')
    w, h = wild_crop.size
    def wild_bg(x, y):
        H, S, V = wild_hsv.getpixel((x, y))
        return (V > 230 and S < 75) or (S < 50)
    seeds = get_border_seeds(w, h, wild_bg)
    wild_res = normalize_canvas(bfs_clean(wild_crop, seeds, wild_bg))
    wild_res.save(os.path.join(SYMBOLS_DIR, 'wild.png'))

    print('Mid-pay and special symbols re-processed perfectly!')

if __name__ == '__main__':
    process_mid_and_special()
    # Also sync to client/src/assets/symbols
    os.system('cp /Applications/XAMPP/xamppfiles/htdocs/Solana-Slot-Game/client/public/assets/symbols/* /Applications/XAMPP/xamppfiles/htdocs/Solana-Slot-Game/client/src/assets/symbols/')
