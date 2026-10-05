import os
from PIL import Image, ImageDraw

SRC_DIR = '/Applications/XAMPP/xamppfiles/htdocs/Solana-Slot-Game/img'
PUB_SYM = '/Applications/XAMPP/xamppfiles/htdocs/Solana-Slot-Game/client/public/assets/symbols'
PUB_UI = '/Applications/XAMPP/xamppfiles/htdocs/Solana-Slot-Game/client/public/assets/ui'
SRC_SYM = '/Applications/XAMPP/xamppfiles/htdocs/Solana-Slot-Game/client/src/assets/symbols'
SRC_UI = '/Applications/XAMPP/xamppfiles/htdocs/Solana-Slot-Game/client/src/assets/ui'

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

def process_all():
    os.makedirs(PUB_SYM, exist_ok=True)
    os.makedirs(PUB_UI, exist_ok=True)
    os.makedirs(SRC_SYM, exist_ok=True)
    os.makedirs(SRC_UI, exist_ok=True)

    # 1. Letters (Low Pay: A, K, Q, J, 10) - Tight cut
    letters_file = os.path.join(SRC_DIR, 'gpt-image-2_full_set_of_slot_game_symbols_A_K_Q_J_10_stylized_as_ancient_egyptian_hieroglyph-0.jpg')
    letters_im = Image.open(letters_file)
    letter_boxes = {
        'a': (70, 60, 490, 490),
        'k': (500, 60, 930, 490),
        'q': (10, 510, 310, 900),
        'j': (300, 510, 530, 900),
        '10': (530, 510, 990, 900)
    }
    for name, box in letter_boxes.items():
        crop = letters_im.crop(box)
        w, h = crop.size
        hsv = crop.convert('HSV')
        def l_bg(x, y):
            H, S, V = hsv.getpixel((x, y))
            return (S < 45) or (V > 215 and S < 75)
        seeds = get_border_seeds(w, h, l_bg)
        if name == '10':
            seeds.append((330, 200))
        elif name == 'a':
            seeds.append((w // 2, h - 40))
        elif name == 'q':
            seeds.append((w // 2, h // 2 - 20))
        elif name == 'k':
            seeds.append((w // 2, h // 2))
        res = normalize_canvas(bfs_clean(crop, seeds, l_bg))
        res.save(os.path.join(PUB_SYM, f'{name}.png'))

    # 2. Mid Pay: scarab, ankh, eye, scepter
    mid_file = os.path.join(SRC_DIR, 'lucid-origin_set_of_4_mid-pay_slot_game_symbols_golden_scarab_beetle_with_wings_ankh_cross_wi-0.jpg')
    mid_im = Image.open(mid_file)
    
    # Ankh
    ankh_crop = mid_im.crop((550, 30, 920, 480))
    w, h = ankh_crop.size
    hsv = ankh_crop.convert('HSV')
    seeds = get_border_seeds(w, h, lambda x, y: hsv.getpixel((x, y))[1] < 90 or (hsv.getpixel((x, y))[1] < 135 and hsv.getpixel((x, y))[2] < 165))
    seeds.append((w // 2, 115))
    normalize_canvas(bfs_clean(ankh_crop, seeds, lambda x, y: hsv.getpixel((x, y))[1] < 90 or (hsv.getpixel((x, y))[1] < 135 and hsv.getpixel((x, y))[2] < 165))).save(os.path.join(PUB_SYM, 'ankh.png'))

    # Eye
    eye_crop = mid_im.crop((35, 545, 485, 925))
    w, h = eye_crop.size
    hsv = eye_crop.convert('HSV')
    seeds = get_border_seeds(w, h, lambda x, y: hsv.getpixel((x, y))[1] < 90 or (hsv.getpixel((x, y))[1] < 135 and hsv.getpixel((x, y))[2] < 170))
    seeds.append((120, 280))
    normalize_canvas(bfs_clean(eye_crop, seeds, lambda x, y: hsv.getpixel((x, y))[1] < 90 or (hsv.getpixel((x, y))[1] < 135 and hsv.getpixel((x, y))[2] < 170))).save(os.path.join(PUB_SYM, 'eye.png'))

    # Scarab
    scarab_crop = mid_im.crop((20, 45, 505, 455))
    w, h = scarab_crop.size
    hsv = scarab_crop.convert('HSV')
    seeds = get_border_seeds(w, h, lambda x, y: hsv.getpixel((x, y))[1] < 85 or (hsv.getpixel((x, y))[1] < 130 and hsv.getpixel((x, y))[2] < 165))
    normalize_canvas(bfs_clean(scarab_crop, seeds, lambda x, y: hsv.getpixel((x, y))[1] < 85 or (hsv.getpixel((x, y))[1] < 130 and hsv.getpixel((x, y))[2] < 165))).save(os.path.join(PUB_SYM, 'scarab.png'))

    # Scepter
    scepter_crop = mid_im.crop((560, 500, 910, 980))
    w, h = scepter_crop.size
    hsv = scepter_crop.convert('HSV')
    seeds = get_border_seeds(w, h, lambda x, y: hsv.getpixel((x, y))[1] < 90 or (hsv.getpixel((x, y))[1] < 135 and hsv.getpixel((x, y))[2] < 165))
    normalize_canvas(bfs_clean(scepter_crop, seeds, lambda x, y: hsv.getpixel((x, y))[1] < 90 or (hsv.getpixel((x, y))[1] < 135 and hsv.getpixel((x, y))[2] < 165))).save(os.path.join(PUB_SYM, 'scepter.png'))

    # 3. High Pay (Gods / Characters: Anubis, Pharaoh, Cleopatra, Prince) - Tight cut
    high_file = os.path.join(SRC_DIR, 'lucid-origin_set_of_4_high-pay_slot_game_character_symbols_in_circular_and_rectangular_golden-0.jpg')
    high_im = Image.open(high_file)
    high_boxes = {
        'anubis': ((30, 15, 490, 490), 80),
        'pharaoh': ((510, 30, 970, 490), 85),
        'cleopatra': ((30, 510, 490, 970), 85),
        'prince': ((510, 510, 970, 970), 85)
    }
    for name, (box, s_thresh) in high_boxes.items():
        crop = high_im.crop(box)
        w, h = crop.size
        hsv = crop.convert('HSV')
        seeds = get_border_seeds(w, h, lambda x, y: hsv.getpixel((x, y))[1] < s_thresh)
        normalize_canvas(bfs_clean(crop, seeds, lambda x, y: hsv.getpixel((x, y))[1] < s_thresh)).save(os.path.join(PUB_SYM, f'{name}.png'))

    # 4. Mascot Archaeologist
    banner_file = os.path.join(SRC_DIR, 'gpt-image-2_game_promotional_banner_for_a_slot_game_titled_Lost_Relics_of_Ra_cinematic_ancie-0.jpg')
    banner = Image.open(banner_file).convert('RGBA')
    adv = banner.crop((640, 240, 950, 560)).resize((230, 230), Image.Resampling.LANCZOS)
    mask = Image.new('L', (230, 230), 0)
    ImageDraw.Draw(mask).ellipse((10, 10, 220, 220), fill=255)
    framed = Image.new('RGBA', (256, 256), (0, 0, 0, 0))
    framed.paste(adv, (13, 13), mask)
    draw = ImageDraw.Draw(framed)
    draw.ellipse((10, 10, 245, 245), outline=(218, 165, 32, 255), width=8)
    draw.ellipse((14, 14, 241, 241), outline=(255, 223, 100, 255), width=3)
    draw.ellipse((20, 20, 235, 235), outline=(139, 90, 0, 255), width=3)
    framed.save(os.path.join(PUB_SYM, 'archaeologist.png'))

    # 5. Scatter & Wild (Tight cut)
    sp_file = os.path.join(SRC_DIR, 'gpt-image-2_set_of_2_special_slot_symbols_Scatter_symbol_as_a_glowing_ancient_magic_book_wit-0.jpg')
    sp_im = Image.open(sp_file)

    # Scatter
    scatter_crop = sp_im.crop((15, 110, 475, 840))
    w, h = scatter_crop.size
    hsv = scatter_crop.convert('HSV')
    def sc_bg(x, y):
        H, S, V = hsv.getpixel((x, y))
        return (V > 225 and S < 155) or (S < 70)
    seeds = get_border_seeds(w, h, sc_bg)
    seeds.append((175, 530))
    normalize_canvas(bfs_clean(scatter_crop, seeds, sc_bg)).save(os.path.join(PUB_SYM, 'scatter.png'))

    # Wild
    wild_crop = sp_im.crop((510, 110, 990, 840))
    w, h = wild_crop.size
    hsv = wild_crop.convert('HSV')
    def wd_bg(x, y):
        H, S, V = hsv.getpixel((x, y))
        return (S < 75) or (V > 220 and S < 135)
    seeds = get_border_seeds(w, h, wd_bg)
    normalize_canvas(bfs_clean(wild_crop, seeds, wd_bg)).save(os.path.join(PUB_SYM, 'wild.png'))

    # 6. UI Assets
    # Frame (Tight cut - no white outer border, transparent 5 reel windows)
    frame_file = os.path.join(SRC_DIR, 'frames-0.jpg')
    frame = Image.open(frame_file).convert('RGBA')
    w, h = frame.size
    pixels = frame.load()
    def frame_bg(x, y):
        r, g, b, a = pixels[x, y]
        bright = (r + g + b) / 3
        return (bright > 205) or (min(r, g, b) > 185)
    visited = set()
    queue = []
    for x in range(w):
        for y in (0, h - 1):
            if frame_bg(x, y): queue.append((x, y)); visited.add((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if (x, y) not in visited and frame_bg(x, y): queue.append((x, y)); visited.add((x, y))
    head = 0
    while head < len(queue):
        cx, cy = queue[head]; head += 1
        pixels[cx, cy] = (0, 0, 0, 0)
        for nx, ny in ((cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)):
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited and frame_bg(nx, ny):
                visited.add((nx, ny)); queue.append((nx, ny))
    columns = [(145, 284), (295, 434), (445, 584), (595, 734), (745, 884)]
    for x1, x2 in columns:
        for y in range(305, 712):
            for x in range(x1, x2):
                pixels[x, y] = (0, 0, 0, 0)
    frame.save(os.path.join(PUB_UI, 'frame.png'))

    # Big Win (Clean background, preserve sunburst, clean coins)
    bw_file = os.path.join(SRC_DIR, 'gpt-image-2_slot_game_big_win_popup_frame_ancient_egyptian_golden_banner_ornamental_borders_-0.jpg')
    bw = Image.open(bw_file).convert('RGBA')
    hsv_bw = bw.convert('HSV')
    w, h = bw.size
    pixels_bw = bw.load()
    def bw_bg(x, y):
        H, S, V = hsv_bw.getpixel((x, y))
        if S < 25 and V > 230: return True
        if S < 60 and V > 170 and not (H >= 25 and H <= 50 and V >= 240 and S >= 25): return True
        return False
    visited = set()
    queue = []
    for x in range(w):
        for y in (0, h - 1):
            if bw_bg(x, y): queue.append((x, y)); visited.add((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if (x, y) not in visited and bw_bg(x, y): queue.append((x, y)); visited.add((x, y))
    head = 0
    while head < len(queue):
        cx, cy = queue[head]; head += 1
        pixels_bw[cx, cy] = (0, 0, 0, 0)
        for nx, ny in ((cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)):
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited and bw_bg(nx, ny):
                visited.add((nx, ny)); queue.append((nx, ny))
    bw.save(os.path.join(PUB_UI, 'big_win.png'))

    # Background, Banner, Icon, Scroll
    Image.open(os.path.join(SRC_DIR, 'lucid-origin_inside_ancient_egyptian_pyramid_tomb_background_for_slot_game_stone_pillars_with-0.jpg')).save(os.path.join(PUB_UI, 'background.jpg'), 'JPEG', quality=95)
    Image.open(os.path.join(SRC_DIR, 'gpt-image-2_game_promotional_banner_for_a_slot_game_titled_Lost_Relics_of_Ra_cinematic_ancie-0.jpg')).save(os.path.join(PUB_UI, 'banner.jpg'), 'JPEG', quality=95)
    Image.open(os.path.join(SRC_DIR, 'lucid-origin_game_app_icon_design_glowing_golden_egyptian_scarab_beetle_with_lapis_lazuli_gem-0.jpg')).save(os.path.join(PUB_UI, 'icon.png'), 'PNG')
    
    scroll_file = os.path.join(SRC_DIR, 'gpt-image-2_ancient_papyrus_scroll_frame_for_game_paytable_UI_egyptian_golden_borders_dark_p-0.jpg')
    scroll_im = Image.open(scroll_file).convert('RGBA')
    hsv_sc = scroll_im.convert('HSV')
    seeds = get_border_seeds(scroll_im.width, scroll_im.height, lambda x, y: hsv_sc.getpixel((x, y))[1] < 40 and hsv_sc.getpixel((x, y))[2] > 200)
    bfs_clean(scroll_im, seeds, lambda x, y: hsv_sc.getpixel((x, y))[1] < 40 and hsv_sc.getpixel((x, y))[2] > 200).save(os.path.join(PUB_UI, 'paytable_scroll.png'))

    # 7. VFX - Light Beam (Tight & Smooth Holy Light Pillar)
    beam_file = os.path.join(SRC_DIR, 'lucid-origin_vertical_beam_of_golden_sunlight_holy_light_pillar_with_floating_golden_dust_par-0.jpg')
    if os.path.exists(beam_file):
        from PIL import ImageFilter
        orig_beam = Image.open(beam_file)
        bw, bh = orig_beam.size
        orig_pixels = orig_beam.load()
        med = orig_beam.filter(ImageFilter.MedianFilter(size=21))
        med_pixels = med.load()
        alpha_raw = Image.new('L', (bw, bh), 0)
        ar_pixels = alpha_raw.load()

        for y in range(bh):
            for x in range(bw):
                r, g, b = orig_pixels[x, y]
                mr, mg, mb = med_pixels[x, y]
                m_bright = (mr + mg + mb) / 3.0
                m_gold = mr - mb
                dist_c = abs(x - 512)
                if (m_bright > 225 and dist_c < 75) or (dist_c < 45 and m_bright > 190):
                    ar_pixels[x, y] = 255
                elif y > 870 and dist_c < 200 and mr > 185 and m_gold > 40:
                    t = min(1.0, max(0.0, (m_gold - 40) / 45.0))
                    ar_pixels[x, y] = int(255 * (t * t * (3 - 2 * t)))
                elif (r > 215 and (r - b) > 35 and (r - mr > 8 or g - mg > 7)) or (dist_c < 120 and r > 230 and g > 210):
                    ar_pixels[x, y] = min(255, int(r * 0.98))
                elif m_gold > 60 and mr > 182:
                    t = min(1.0, max(0.0, (m_gold - 60) / 45.0))
                    a = t * t * (3 - 2 * t)
                    if m_bright > 190: a = min(1.0, a * 1.25)
                    if y < 860 and dist_c > 80:
                        a *= max(0.0, 1.0 - (dist_c - 80) / 55.0)
                    ar_pixels[x, y] = int(a * 255)

        alpha_smooth = alpha_raw.filter(ImageFilter.GaussianBlur(radius=1.5))
        as_pixels = alpha_smooth.load()
        out_beam = Image.new('RGBA', (bw, bh), (0, 0, 0, 0))
        out_pixels = out_beam.load()

        for y in range(bh):
            for x in range(bw):
                a = as_pixels[x, y]
                if a > 3:
                    r, g, b = orig_pixels[x, y]
                    mr, mg, mb = med_pixels[x, y]
                    dist_c = abs(x - 512)
                    gr = min(255, int(mr * 1.15))
                    gg = min(255, int(mg * 1.05))
                    gb = max(0, int(mb * 0.5))
                    if r - mr > 8 and r > 200:
                        out_pixels[x, y] = (min(255, int(r * 1.08)), min(255, int(g * 1.04)), max(0, int(b * 0.6)), a)
                        continue
                    core_w = 90 if y > 880 else 35
                    blend_w = 40 if y > 880 else 20
                    if dist_c <= core_w: w_orig = 1.0
                    elif dist_c >= core_w + blend_w: w_orig = 0.0
                    else:
                        t = (dist_c - core_w) / float(blend_w)
                        w_orig = 1.0 - (t * t * (3 - 2 * t))
                    fr = int(r * w_orig + gr * (1.0 - w_orig))
                    fg = int(g * w_orig + gg * (1.0 - w_orig))
                    fb = int(b * w_orig + gb * (1.0 - w_orig))
                    out_pixels[x, y] = (fr, fg, fb, a)

        vfx_dir = '/Applications/XAMPP/xamppfiles/htdocs/Solana-Slot-Game/client/public/assets/vfx'
        os.makedirs(vfx_dir, exist_ok=True)
        crop_beam = out_beam.crop(out_beam.getbbox())
        crop_beam.save(os.path.join(vfx_dir, 'light_beam.png'))

    # 8. VFX - Magic Aura & Sparks (Slice 3x3 into 9 items)
    aura_sheet_file = os.path.join(PUB_VFX, 'magic_aura.png')
    if os.path.exists(aura_sheet_file):
        import shutil
        aura_im = Image.open(aura_sheet_file)
        aw, ah = aura_im.size
        cw, ch = aw // 3, ah // 3
        for r in range(3):
            for c in range(3):
                idx = r * 3 + c
                x0, y0 = c * cw, r * ch
                x1 = (c + 1) * cw if c < 2 else aw
                y1 = (r + 1) * ch if r < 2 else ah
                crop = aura_im.crop((x0, y0, x1, y1)).copy()
                item_w, item_h = crop.size
                cp = crop.load()
                for y in range(item_h):
                    for x in range(item_w):
                        red, g, b, a = cp[x, y]
                        bright = (red + g + b) / 3.0
                        diff = max(abs(red - g), abs(red - b), abs(g - b))
                        if diff <= 10 and bright <= 48:
                            cp[x, y] = (0, 0, 0, 0)
                        elif diff <= 14 and bright <= 58:
                            fade = max(0.0, (bright - 48) / 10.0)
                            cp[x, y] = (red, g, b, int(a * fade))
                        if (x == 0 or x == item_w - 1 or y == 0 or y == item_h - 1) and diff < 25:
                            cp[x, y] = (0, 0, 0, 0)
                crop.save(os.path.join(PUB_VFX, f'magic_aura_{idx}.png'))
                crop.save(os.path.join(PUB_VFX, f'aura_{idx}.png'))

    # 9. VFX - Golden Sparkles, Fire Sparks & Floating Dust (Slice 3x3 into 9 items)
    particle_file = os.path.join(SRC_DIR, 'lucid-origin_game_particle_effect_asset_sheet_golden_sparkles_fire_sparks_floating_golden_dus-0 (1).jpg')
    if os.path.exists(particle_file):
        from PIL import ImageFilter
        p_im = Image.open(particle_file)
        pw, ph = p_im.size
        p_pixels = p_im.load()
        p_alpha = Image.new('L', (pw, ph), 0)
        p_ap = p_alpha.load()

        for y in range(ph):
            for x in range(pw):
                r, g, b = p_pixels[x, y]
                bright = (r + g + b) / 3.0
                gold = r - b
                diff = max(abs(r - g), abs(r - b), abs(g - b))
                if diff <= 8 and bright <= 76:
                    p_ap[x, y] = 0
                    continue
                if bright > 175 and r > 175 and g > 140:
                    p_ap[x, y] = 255
                elif gold > 16 and r > 80:
                    t = min(1.0, max(0.0, (gold - 16) / 50.0))
                    a = t * t * (3 - 2 * t)
                    if bright > 100: a = min(1.0, a * 1.35)
                    p_ap[x, y] = int(a * 255)
                elif r > 115 and g > 85 and gold > 12:
                    p_ap[x, y] = min(255, int((r - 75) * 2.6))
                else:
                    p_ap[x, y] = 0

        p_smooth = p_alpha.filter(ImageFilter.GaussianBlur(radius=0.9))
        p_asp = p_smooth.load()
        full_particles = Image.new('RGBA', (pw, ph), (0, 0, 0, 0))
        p_fcp = full_particles.load()

        for y in range(ph):
            for x in range(pw):
                a = p_asp[x, y]
                if a > 4:
                    r, g, b = p_pixels[x, y]
                    gr = min(255, int(r * 1.18))
                    gg = min(255, int(g * 1.08))
                    gb = max(0, int(b * 0.45))
                    p_fcp[x, y] = (gr, gg, gb, a)

        full_particles.save(os.path.join(PUB_VFX, 'particles_sheet.png'))
        pcw, pch = pw // 3, ph // 3
        for r in range(3):
            for c in range(3):
                idx = r * 3 + c
                x0 = c * pcw
                y0 = r * pch
                x1 = (c + 1) * pcw if c < 2 else pw
                y1 = (r + 1) * pch if r < 2 else ph
                p_crop = full_particles.crop((x0, y0, x1, y1)).copy()
                item_w, item_h = p_crop.size
                cp = p_crop.load()
                for py in range(item_h):
                    for px in range(item_w):
                        if (px <= 1 or px >= item_w - 2 or py <= 1 or py >= item_h - 2) and cp[px, py][3] < 160:
                            cp[px, py] = (0, 0, 0, 0)
                p_crop.save(os.path.join(PUB_VFX, f'spark_{idx}.png'))
                p_crop.save(os.path.join(PUB_VFX, f'particle_{idx}.png'))

    # Sync all files to client/src/assets/
    os.system('cp -r /Applications/XAMPP/xamppfiles/htdocs/Solana-Slot-Game/client/public/assets/* /Applications/XAMPP/xamppfiles/htdocs/Solana-Slot-Game/client/src/assets/')
    print('All assets processed and synced perfectly!')

if __name__ == '__main__':
    process_all()
