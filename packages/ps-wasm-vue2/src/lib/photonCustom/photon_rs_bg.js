let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* Adds an offset to the image by a certain number of pixels.
*
* This creates an RGB shift effect.
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* * `offset` - The offset is added to the pixels in the image.
* # Example
*
* ```no_run
* // For example, to offset pixels by 30 pixels on the red channel:
* use photon_rs::effects::offset;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* offset(&mut img, 0_usize, 30_u32);
* ```
* @param {PhotonImage} photon_image
* @param {number} channel_index
* @param {number} offset
*/
export function offset(photon_image, channel_index, offset) {
    _assertClass(photon_image, PhotonImage);
    wasm.offset(photon_image.ptr, channel_index, offset);
}

/**
* Adds an offset to the red channel by a certain number of pixels.
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* * `offset` - The offset you want to move the red channel by.
* # Example
*
* ```no_run
* // For example, to add an offset to the red channel by 30 pixels.
* use photon_rs::effects::offset_red;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* offset_red(&mut img, 30_u32);
* ```
* @param {PhotonImage} img
* @param {number} offset_amt
*/
export function offset_red(img, offset_amt) {
    _assertClass(img, PhotonImage);
    wasm.offset_red(img.ptr, offset_amt);
}

/**
* Adds an offset to the green channel by a certain number of pixels.
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* * `offset` - The offset you want to move the green channel by.
* # Example
*
* ```no_run
* // For example, to add an offset to the green channel by 30 pixels.
* use photon_rs::effects::offset_green;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* offset_green(&mut img, 30_u32);
* ```
* @param {PhotonImage} img
* @param {number} offset_amt
*/
export function offset_green(img, offset_amt) {
    _assertClass(img, PhotonImage);
    wasm.offset_green(img.ptr, offset_amt);
}

/**
* Adds an offset to the blue channel by a certain number of pixels.
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* * `offset_amt` - The offset you want to move the blue channel by.
* # Example
* // For example, to add an offset to the green channel by 40 pixels.
*
* ```no_run
* use photon_rs::effects::offset_blue;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* offset_blue(&mut img, 40_u32);
* ```
* @param {PhotonImage} img
* @param {number} offset_amt
*/
export function offset_blue(img, offset_amt) {
    _assertClass(img, PhotonImage);
    wasm.offset_blue(img.ptr, offset_amt);
}

/**
* Adds multiple offsets to the image by a certain number of pixels (on two channels).
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* * `offset` - The offset is added to the pixels in the image.
* # Example
*
* ```no_run
* // For example, to add a 30-pixel offset to both the red and blue channels:
* use photon_rs::effects::multiple_offsets;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* multiple_offsets(&mut img, 30_u32, 0_usize, 2_usize);
* ```
* @param {PhotonImage} photon_image
* @param {number} offset
* @param {number} channel_index
* @param {number} channel_index2
*/
export function multiple_offsets(photon_image, offset, channel_index, channel_index2) {
    _assertClass(photon_image, PhotonImage);
    wasm.multiple_offsets(photon_image.ptr, offset, channel_index, channel_index2);
}

/**
* Reduces an image to the primary colours.
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* # Example
*
* ```no_run
* // For example, to add a primary colour effect to an image of type `DynamicImage`:
* use photon_rs::effects::primary;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* primary(&mut img);
* ```
* @param {PhotonImage} img
*/
export function primary(img) {
    _assertClass(img, PhotonImage);
    wasm.primary(img.ptr);
}

/**
* Colorizes the green channels of the image.
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* # Example
*
* ```no_run
* // For example, to colorize an image of type `PhotonImage`:
* use photon_rs::effects::colorize;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* colorize(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function colorize(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.colorize(photon_image.ptr);
}

/**
* Applies a solarizing effect to an image.
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* # Example
*
* ```no_run
* // For example, to colorize an image of type `PhotonImage`:
* use photon_rs::effects::solarize;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* solarize(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function solarize(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.solarize(photon_image.ptr);
}

/**
* Applies a solarizing effect to an image and returns the resulting PhotonImage.
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* # Example
*
* ```no_run
* // For example, to solarize "retimg" an image of type `PhotonImage`:
* use photon_rs::effects::solarize_retimg;
* use photon_rs::native::open_image;
* use photon_rs::PhotonImage;
*
* let img = open_image("img.jpg").expect("File should open");
* let result: PhotonImage = solarize_retimg(&img);
* ```
* @param {PhotonImage} photon_image
* @returns {PhotonImage}
*/
export function solarize_retimg(photon_image) {
    _assertClass(photon_image, PhotonImage);
    const ret = wasm.solarize_retimg(photon_image.ptr);
    return PhotonImage.__wrap(ret);
}

/**
* Increase the brightness of an image by a factor.
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* * `brightness` - A u8 to add to the brightness.
* # Example
*
* ```no_run
* use photon_rs::effects::inc_brightness;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* inc_brightness(&mut img, 10_u8);
* ```
* @param {PhotonImage} photon_image
* @param {number} brightness
*/
export function inc_brightness(photon_image, brightness) {
    _assertClass(photon_image, PhotonImage);
    wasm.inc_brightness(photon_image.ptr, brightness);
}

/**
* Adjust the contrast of an image by a factor.
*
* # Arguments
* * `photon_image` - A PhotonImage that contains a view into the image.
* * `contrast` - An f32 factor used to adjust contrast. Between [-255.0, 255.0]. The algorithm will
* clamp results if passed factor is out of range.
* # Example
*
* ```no_run
* use photon_rs::effects::adjust_contrast;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* adjust_contrast(&mut img, 30_f32);
* ```
* @param {PhotonImage} photon_image
* @param {number} contrast
*/
export function adjust_contrast(photon_image, contrast) {
    _assertClass(photon_image, PhotonImage);
    wasm.adjust_contrast(photon_image.ptr, contrast);
}

/**
* Tint an image by adding an offset to averaged RGB channel values.
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* * `r_offset` - The amount the R channel should be incremented by.
* * `g_offset` - The amount the G channel should be incremented by.
* * `b_offset` - The amount the B channel should be incremented by.
* # Example
*
* ```no_run
* // For example, to tint an image of type `PhotonImage`:
* use photon_rs::effects::tint;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* tint(&mut img, 10_u32, 20_u32, 15_u32);
* ```
* @param {PhotonImage} photon_image
* @param {number} r_offset
* @param {number} g_offset
* @param {number} b_offset
*/
export function tint(photon_image, r_offset, g_offset, b_offset) {
    _assertClass(photon_image, PhotonImage);
    wasm.tint(photon_image.ptr, r_offset, g_offset, b_offset);
}

/**
* Horizontal strips. Divide an image into a series of equal-height strips, for an artistic effect.
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* * `num_strips` - The numbder of strips
* # Example
*
* ```no_run
* // For example, to oil an image of type `PhotonImage`:
* use photon_rs::effects::horizontal_strips;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* horizontal_strips(&mut img, 8u8);
* ```
* @param {PhotonImage} photon_image
* @param {number} num_strips
*/
export function horizontal_strips(photon_image, num_strips) {
    _assertClass(photon_image, PhotonImage);
    wasm.horizontal_strips(photon_image.ptr, num_strips);
}

/**
* Horizontal strips. Divide an image into a series of equal-width strips, for an artistic effect. Sepcify a color as well.
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* * `num_strips` - The numbder of strips
* * `color` - Color of strips.
* # Example
*
* ```no_run
* // For example, to oil an image of type `PhotonImage`:
* use photon_rs::effects::color_horizontal_strips;
* use photon_rs::native::open_image;
* use photon_rs::Rgb;
*
* let color = Rgb::new(255u8, 0u8, 0u8);
* let mut img = open_image("img.jpg").expect("File should open");
* color_horizontal_strips(&mut img, 8u8, color);
* ```
* @param {PhotonImage} photon_image
* @param {number} num_strips
* @param {Rgb} color
*/
export function color_horizontal_strips(photon_image, num_strips, color) {
    _assertClass(photon_image, PhotonImage);
    _assertClass(color, Rgb);
    var ptr0 = color.__destroy_into_raw();
    wasm.color_horizontal_strips(photon_image.ptr, num_strips, ptr0);
}

/**
* Vertical strips. Divide an image into a series of equal-width strips, for an artistic effect.
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* * `num_strips` - The numbder of strips
* # Example
*
* ```no_run
* // For example, to oil an image of type `PhotonImage`:
* use photon_rs::effects::vertical_strips;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* vertical_strips(&mut img, 8u8);
* ```
* @param {PhotonImage} photon_image
* @param {number} num_strips
*/
export function vertical_strips(photon_image, num_strips) {
    _assertClass(photon_image, PhotonImage);
    wasm.vertical_strips(photon_image.ptr, num_strips);
}

/**
* Vertical strips. Divide an image into a series of equal-width strips, for an artistic effect. Sepcify a color as well.
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* * `num_strips` - The numbder of strips
* * `color` - Color of strips.
* # Example
*
* ```no_run
* // For example, to oil an image of type `PhotonImage`:
* use photon_rs::effects::color_vertical_strips;
* use photon_rs::native::open_image;
* use photon_rs::Rgb;
*
* let color = Rgb::new(255u8, 0u8, 0u8);
* let mut img = open_image("img.jpg").expect("File should open");
* color_vertical_strips(&mut img, 8u8, color);
* ```
* @param {PhotonImage} photon_image
* @param {number} num_strips
* @param {Rgb} color
*/
export function color_vertical_strips(photon_image, num_strips, color) {
    _assertClass(photon_image, PhotonImage);
    _assertClass(color, Rgb);
    var ptr0 = color.__destroy_into_raw();
    wasm.color_vertical_strips(photon_image.ptr, num_strips, ptr0);
}

/**
* Turn an image into an oil painting
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* * `radius` - Radius of each paint particle
* * `intesnity` - How artsy an Image should be
* # Example
*
* ```no_run
* // For example, to oil an image of type `PhotonImage`:
* use photon_rs::effects::oil;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* oil(&mut img, 4i32, 55.0);
* ```
* @param {PhotonImage} photon_image
* @param {number} radius
* @param {number} intensity
*/
export function oil(photon_image, radius, intensity) {
    _assertClass(photon_image, PhotonImage);
    wasm.oil(photon_image.ptr, radius, intensity);
}

/**
* Turn an image into an frosted glass see through
*
* # Arguments
* * `img` - A PhotonImage that contains a view into the image.
* # Example
*
* ```no_run
* // For example, to turn an image of type `PhotonImage` into frosted glass see through:
* use photon_rs::effects::frosted_glass;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* frosted_glass(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function frosted_glass(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.frosted_glass(photon_image.ptr);
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}
/**
* @param {string} base64
* @returns {PhotonImage}
*/
export function base64_to_image(base64) {
    const ptr0 = passStringToWasm0(base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.base64_to_image(ptr0, len0);
    return PhotonImage.__wrap(ret);
}

/**
* Convert ImageData to a raw pixel vec of u8s.
* @param {ImageData} imgdata
* @returns {Uint8Array}
*/
export function to_raw_pixels(imgdata) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.to_raw_pixels(retptr, addHeapObject(imgdata));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* Convert a base64 string to a Vec of u8s.
* @param {string} base64
* @returns {Uint8Array}
*/
export function base64_to_vec(base64) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.base64_to_vec(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* Apply gamma correction.
* Image manipulation effects in the LCh colour space
*
* Effects include:
* * **saturate** - Saturation increase.
* * **desaturate** - Desaturate the image.
* * **shift_hue** - Hue rotation by a specified number of degrees.
* * **darken** - Decrease the brightness.
* * **lighten** - Increase the brightness.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* * `mode` - The effect desired to be applied. Choose from: `saturate`, `desaturate`, `shift_hue`, `darken`, `lighten`
* * `amt` - A float value from 0 to 1 which represents the amount the effect should be increased by.
* # Example
* ```no_run
* // For example to increase the saturation by 10%:
* use photon_rs::colour_spaces::lch;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* lch(&mut img, "saturate", 0.1_f32);
* ```
* @param {PhotonImage} photon_image
* @param {string} mode
* @param {number} amt
*/
export function lch(photon_image, mode, amt) {
    _assertClass(photon_image, PhotonImage);
    const ptr0 = passStringToWasm0(mode, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.lch(photon_image.ptr, ptr0, len0, amt);
}

/**
* Image manipulation effects in the HSL colour space.
*
* Effects include:
* * **saturate** - Saturation increase.
* * **desaturate** - Desaturate the image.
* * **shift_hue** - Hue rotation by a specified number of degrees.
* * **darken** - Decrease the brightness.
* * **lighten** - Increase the brightness.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* * `mode` - The effect desired to be applied. Choose from: `saturate`, `desaturate`, `shift_hue`, `darken`, `lighten`
* * `amt` - A float value from 0 to 1 which represents the amount the effect should be increased by.
* # Example
* ```no_run
* // For example to increase the saturation by 10%:
* use photon_rs::colour_spaces::hsl;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* hsl(&mut img, "saturate", 0.1_f32);
* ```
* @param {PhotonImage} photon_image
* @param {string} mode
* @param {number} amt
*/
export function hsl(photon_image, mode, amt) {
    _assertClass(photon_image, PhotonImage);
    const ptr0 = passStringToWasm0(mode, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.hsl(photon_image.ptr, ptr0, len0, amt);
}

/**
* Image manipulation in the HSV colour space.
*
* Effects include:
* * **saturate** - Saturation increase.
* * **desaturate** - Desaturate the image.
* * **shift_hue** - Hue rotation by a specified number of degrees.
* * **darken** - Decrease the brightness.
* * **lighten** - Increase the brightness.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* * `mode` - The effect desired to be applied. Choose from: `saturate`, `desaturate`, `shift_hue`, `darken`, `lighten`
* * `amt` - A float value from 0 to 1 which represents the amount the effect should be increased by.
*
* # Example
* ```no_run
* // For example to increase the saturation by 10%:
* use photon_rs::colour_spaces::hsv;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* hsv(&mut img, "saturate", 0.1_f32);
* ```
* @param {PhotonImage} photon_image
* @param {string} mode
* @param {number} amt
*/
export function hsv(photon_image, mode, amt) {
    _assertClass(photon_image, PhotonImage);
    const ptr0 = passStringToWasm0(mode, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.hsv(photon_image.ptr, ptr0, len0, amt);
}

/**
* Shift hue by a specified number of degrees in the HSL colour space.
* # Arguments
* * `img` - A PhotonImage.
* * `mode` - A float value from 0 to 1 which is the amount to shift the hue by, or hue rotate by.
*
* # Example
* ```no_run
* // For example to hue rotate/shift the hue by 120 degrees in the HSL colour space:
* use photon_rs::colour_spaces::hue_rotate_hsl;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* hue_rotate_hsl(&mut img, 120_f32);
* ```
* @param {PhotonImage} img
* @param {number} degrees
*/
export function hue_rotate_hsl(img, degrees) {
    _assertClass(img, PhotonImage);
    wasm.hue_rotate_hsl(img.ptr, degrees);
}

/**
* Shift hue by a specified number of degrees in the HSV colour space.
* # Arguments
* * `img` - A PhotonImage.
* * `mode` - A float value from 0 to 1 which is the amount to shift the hue by, or hue rotate by.
*
* # Example
* ```no_run
* // For example to hue rotate/shift the hue by 120 degrees in the HSV colour space:
* use photon_rs::colour_spaces::hue_rotate_hsv;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* hue_rotate_hsv(&mut img, 120_f32);
* ```
* @param {PhotonImage} img
* @param {number} degrees
*/
export function hue_rotate_hsv(img, degrees) {
    _assertClass(img, PhotonImage);
    wasm.hue_rotate_hsv(img.ptr, degrees);
}

/**
* Shift hue by a specified number of degrees in the LCh colour space.
* # Arguments
* * `img` - A PhotonImage.
* * `mode` - A float value from 0 to 1 which is the amount to shift the hue by, or hue rotate by.
*
* # Example
* ```no_run
* // For example to hue rotate/shift the hue by 120 degrees in the HSL colour space:
* use photon_rs::colour_spaces::hue_rotate_lch;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* hue_rotate_lch(&mut img, 120_f32);
* ```
* @param {PhotonImage} img
* @param {number} degrees
*/
export function hue_rotate_lch(img, degrees) {
    _assertClass(img, PhotonImage);
    wasm.hue_rotate_lch(img.ptr, degrees);
}

/**
* Increase the image's saturation by converting each pixel's colour to the HSL colour space
* and increasing the colour's saturation.
* # Arguments
* * `img` - A PhotonImage.
* * `level` - Float value from 0 to 1 representing the level to which to increase the saturation by.
* The `level` must be from 0 to 1 in floating-point, `f32` format.
* Increasing saturation by 80% would be represented by a `level` of 0.8
*
* # Example
* ```no_run
* // For example to increase saturation by 10% in the HSL colour space:
* use photon_rs::colour_spaces::saturate_hsl;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* saturate_hsl(&mut img, 0.1_f32);
* ```
* @param {PhotonImage} img
* @param {number} level
*/
export function saturate_hsl(img, level) {
    _assertClass(img, PhotonImage);
    wasm.saturate_hsl(img.ptr, level);
}

/**
* Increase the image's saturation in the LCh colour space.
* # Arguments
* * `img` - A PhotonImage.
* * `level` - Float value from 0 to 1 representing the level to which to increase the saturation by.
* The `level` must be from 0 to 1 in floating-point, `f32` format.
* Increasing saturation by 80% would be represented by a `level` of 0.8
*
* # Example
* ```no_run
* // For example to increase saturation by 40% in the Lch colour space:
* use photon_rs::colour_spaces::saturate_lch;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* saturate_lch(&mut img, 0.4_f32);
* ```
* @param {PhotonImage} img
* @param {number} level
*/
export function saturate_lch(img, level) {
    _assertClass(img, PhotonImage);
    wasm.saturate_lch(img.ptr, level);
}

/**
* Increase the image's saturation in the HSV colour space.
* # Arguments
* * `img` - A PhotonImage.
* * `level` - Float value from 0 to 1 representing the level by which to increase the saturation by.
* The `level` must be from 0 to 1 in floating-point, `f32` format.
* Increasing saturation by 80% would be represented by a `level` of 0.8
*
* # Example
* ```no_run
* // For example to increase saturation by 30% in the HSV colour space:
* use photon_rs::colour_spaces::saturate_hsv;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* saturate_hsv(&mut img, 0.3_f32);
* ```
* @param {PhotonImage} img
* @param {number} level
*/
export function saturate_hsv(img, level) {
    _assertClass(img, PhotonImage);
    wasm.saturate_hsv(img.ptr, level);
}

/**
* Lighten an image by a specified amount in the LCh colour space.
*
* # Arguments
* * `img` - A PhotonImage.
* * `level` - Float value from 0 to 1 representing the level to which to lighten the image by.
* The `level` must be from 0 to 1 in floating-point, `f32` format.
* Lightening by 80% would be represented by a `level` of 0.8
*
* # Example
* ```no_run
* // For example to lighten an image by 10% in the LCh colour space:
* use photon_rs::colour_spaces::lighten_lch;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* lighten_lch(&mut img, 0.1_f32);
* ```
* @param {PhotonImage} img
* @param {number} level
*/
export function lighten_lch(img, level) {
    _assertClass(img, PhotonImage);
    wasm.lighten_lch(img.ptr, level);
}

/**
* Lighten an image by a specified amount in the HSL colour space.
* # Arguments
* * `img` - A PhotonImage.
* * `level` - Float value from 0 to 1 representing the level to which to lighten the image by.
* The `level` must be from 0 to 1 in floating-point, `f32` format.
* Lightening by 80% would be represented by a `level` of 0.8
*
* # Example
* ```no_run
* // For example to lighten an image by 10% in the HSL colour space:
* use photon_rs::colour_spaces::lighten_hsl;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* lighten_hsl(&mut img, 0.1_f32);
* ```
* @param {PhotonImage} img
* @param {number} level
*/
export function lighten_hsl(img, level) {
    _assertClass(img, PhotonImage);
    wasm.lighten_hsl(img.ptr, level);
}

/**
* Lighten an image by a specified amount in the HSV colour space.
*
* # Arguments
* * `img` - A PhotonImage.
* * `level` - Float value from 0 to 1 representing the level to which to lighten the image by.
* The `level` must be from 0 to 1 in floating-point, `f32` format.
* Lightening by 80% would be represented by a `level` of 0.8
*
* # Example
* ```no_run
* // For example to lighten an image by 10% in the HSV colour space:
* use photon_rs::colour_spaces::lighten_hsv;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* lighten_hsv(&mut img, 0.1_f32);
* ```
* @param {PhotonImage} img
* @param {number} level
*/
export function lighten_hsv(img, level) {
    _assertClass(img, PhotonImage);
    wasm.lighten_hsv(img.ptr, level);
}

/**
* Darken the image by a specified amount in the LCh colour space.
*
* # Arguments
* * `img` - A PhotonImage.
* * `level` - Float value from 0 to 1 representing the level to which to darken the image by.
* The `level` must be from 0 to 1 in floating-point, `f32` format.
* Darkening by 80% would be represented by a `level` of 0.8
*
* # Example
* ```no_run
* // For example to darken an image by 10% in the LCh colour space:
* use photon_rs::colour_spaces::darken_lch;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* darken_lch(&mut img, 0.1_f32);
* ```
* @param {PhotonImage} img
* @param {number} level
*/
export function darken_lch(img, level) {
    _assertClass(img, PhotonImage);
    wasm.darken_lch(img.ptr, level);
}

/**
* Darken the image by a specified amount in the HSL colour space.
*
* # Arguments
* * `img` - A PhotonImage.
* * `level` - Float value from 0 to 1 representing the level to which to darken the image by.
* The `level` must be from 0 to 1 in floating-point, `f32` format.
* Darkening by 80% would be represented by a `level` of 0.8
*
* # Example
* ```no_run
* // For example to darken an image by 10% in the HSL colour space:
* use photon_rs::colour_spaces::darken_hsl;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* darken_hsl(&mut img, 0.1_f32);
* ```
* @param {PhotonImage} img
* @param {number} level
*/
export function darken_hsl(img, level) {
    _assertClass(img, PhotonImage);
    wasm.darken_hsl(img.ptr, level);
}

/**
* Darken the image's colours by a specified amount in the HSV colour space.
*
* # Arguments
* * `img` - A PhotonImage.
* * `level` - Float value from 0 to 1 representing the level to which to darken the image by.
* The `level` must be from 0 to 1 in floating-point, `f32` format.
* Darkening by 80% would be represented by a `level` of 0.8
*
* # Example
* ```no_run
* // For example to darken an image by 10% in the HSV colour space:
* use photon_rs::colour_spaces::darken_hsv;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* darken_hsv(&mut img, 0.1_f32);
* ```
* @param {PhotonImage} img
* @param {number} level
*/
export function darken_hsv(img, level) {
    _assertClass(img, PhotonImage);
    wasm.darken_hsv(img.ptr, level);
}

/**
* Desaturate the image by a specified amount in the HSV colour space.
*
* # Arguments
* * `img` - A PhotonImage.
* * `level` - Float value from 0 to 1 representing the level to which to desaturate the image by.
* The `level` must be from 0 to 1 in floating-point, `f32` format.
* Desaturating by 80% would be represented by a `level` of 0.8
*
* # Example
* ```no_run
* // For example to desaturate an image by 10% in the HSV colour space:
* use photon_rs::colour_spaces::desaturate_hsv;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* desaturate_hsv(&mut img, 0.1_f32);
* ```
* @param {PhotonImage} img
* @param {number} level
*/
export function desaturate_hsv(img, level) {
    _assertClass(img, PhotonImage);
    wasm.desaturate_hsv(img.ptr, level);
}

/**
* Desaturate the image by a specified amount in the HSL colour space.
*
* # Arguments
* * `img` - A PhotonImage.
* * `level` - Float value from 0 to 1 representing the level to which to desaturate the image by.
* The `level` must be from 0 to 1 in floating-point, `f32` format.
* Desaturating by 80% would be represented by a `level` of 0.8
*
* # Example
* ```no_run
* // For example to desaturate an image by 10% in the LCh colour space:
* use photon_rs::colour_spaces::desaturate_hsl;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* desaturate_hsl(&mut img, 0.1_f32);
* ```
* @param {PhotonImage} img
* @param {number} level
*/
export function desaturate_hsl(img, level) {
    _assertClass(img, PhotonImage);
    wasm.desaturate_hsl(img.ptr, level);
}

/**
* Desaturate the image by a specified amount in the LCh colour space.
*
* # Arguments
* * `img` - A PhotonImage.
* * `level` - Float value from 0 to 1 representing the level to which to desaturate the image by.
* The `level` must be from 0 to 1 in floating-point, `f32` format.
* Desaturating by 80% would be represented by a `level` of 0.8
*
* # Example
* ```no_run
* // For example to desaturate an image by 10% in the LCh colour space:
* use photon_rs::colour_spaces::desaturate_lch;
* use photon_rs::native::open_image;
*
* // Open the image. A PhotonImage is returned.
* let mut img = open_image("img.jpg").expect("File should open");
* desaturate_lch(&mut img, 0.1_f32);
* ```
* @param {PhotonImage} img
* @param {number} level
*/
export function desaturate_lch(img, level) {
    _assertClass(img, PhotonImage);
    wasm.desaturate_lch(img.ptr, level);
}

/**
* Mix image with a single color, supporting passing `opacity`.
* The algorithm comes from Jimp. See `function mix` and `function colorFn` at following link:
* https://github.com/oliver-moran/jimp/blob/29679faa597228ff2f20d34c5758e4d2257065a3/packages/plugin-color/src/index.js
* Specifically, result_value = (mix_color_value - origin_value) * opacity + origin_value =
* mix_color_value * opacity + (1 - opacity) * origin_value for each
* of RGB channel.
*
* # Arguments
* * `photon_image` - A PhotonImage that contains a view into the image.
* * `mix_color` - the color to be mixed in, as an RGB value.
* * `opacity` - the opacity of color when mixed to image. Float value from 0 to 1.
* # Example
*
* ```no_run
* // For example, to mix an image with rgb (50, 255, 254) and opacity 0.4:
* use photon_rs::Rgb;
* use photon_rs::colour_spaces::mix_with_colour;
* use photon_rs::native::open_image;
*
* let mix_colour = Rgb::new(50_u8, 255_u8, 254_u8);
* let mut img = open_image("img.jpg").expect("File should open");
* mix_with_colour(&mut img, mix_colour, 0.4_f32);
* ```
* @param {PhotonImage} photon_image
* @param {Rgb} mix_colour
* @param {number} opacity
*/
export function mix_with_colour(photon_image, mix_colour, opacity) {
    _assertClass(photon_image, PhotonImage);
    _assertClass(mix_colour, Rgb);
    var ptr0 = mix_colour.__destroy_into_raw();
    wasm.mix_with_colour(photon_image.ptr, ptr0, opacity);
}

/**
* Noise reduction.
*
* # Arguments
* * `img` - A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to noise reduct an image:
* use photon_rs::conv::noise_reduction;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* noise_reduction(&mut img);
* ```
* Adds a constant to a select R, G, or B channel's value.
* @param {PhotonImage} photon_image
*/
export function noise_reduction(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.noise_reduction(photon_image.ptr);
}

/**
* Sharpen an image.
*
* # Arguments
* * `img` - A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to sharpen an image:
* use photon_rs::conv::sharpen;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* sharpen(&mut img);
* ```
* Adds a constant to a select R, G, or B channel's value.
* @param {PhotonImage} photon_image
*/
export function sharpen(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.sharpen(photon_image.ptr);
}

/**
* Apply edge detection to an image, to create a dark version with its edges highlighted.
*
* # Arguments
* * `img` - A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to increase the Red channel for all pixels by 10:
* use photon_rs::conv::edge_detection;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* edge_detection(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function edge_detection(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.edge_detection(photon_image.ptr);
}

/**
* Apply an identity kernel convolution to an image.
*
* # Arguments
* * `img` -A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to apply an identity kernel convolution:
* use photon_rs::conv::identity;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* identity(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function identity(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.identity(photon_image.ptr);
}

/**
* Apply a box blur effect.
*
* # Arguments
* * `img` - A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to apply a box blur effect:
* use photon_rs::conv::box_blur;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* box_blur(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function box_blur(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.box_blur(photon_image.ptr);
}

/**
* Gaussian blur in linear time.
*
* Reference: http://blog.ivank.net/fastest-gaussian-blur.html
*
* # Arguments
* * `photon_image` - A PhotonImage
* * `radius` - blur radius
* # Example
*
* ```no_run
* use photon_rs::conv::gaussian_blur;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* gaussian_blur(&mut img, 3_i32);
* ```
* @param {PhotonImage} photon_image
* @param {number} radius
*/
export function gaussian_blur(photon_image, radius) {
    _assertClass(photon_image, PhotonImage);
    wasm.gaussian_blur(photon_image.ptr, radius);
}

/**
* Detect horizontal lines in an image, and highlight these only.
*
* # Arguments
* * `img` - A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to display the horizontal lines in an image:
* use photon_rs::conv::detect_horizontal_lines;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* detect_horizontal_lines(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function detect_horizontal_lines(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.detect_horizontal_lines(photon_image.ptr);
}

/**
* Detect vertical lines in an image, and highlight these only.
*
* # Arguments
* * `img` - A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to display the vertical lines in an image:
* use photon_rs::conv::detect_vertical_lines;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* detect_vertical_lines(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function detect_vertical_lines(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.detect_vertical_lines(photon_image.ptr);
}

/**
* Detect lines at a forty five degree angle in an image, and highlight these only.
*
* # Arguments
* * `img` - A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to display the lines at a forty five degree angle in an image:
* use photon_rs::conv::detect_45_deg_lines;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* detect_45_deg_lines(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function detect_45_deg_lines(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.detect_45_deg_lines(photon_image.ptr);
}

/**
* Detect lines at a 135 degree angle in an image, and highlight these only.
*
* # Arguments
* * `img` - A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to display the lines at a 135 degree angle in an image:
* use photon_rs::conv::detect_135_deg_lines;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* detect_135_deg_lines(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function detect_135_deg_lines(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.detect_135_deg_lines(photon_image.ptr);
}

/**
* Apply a standard laplace convolution.
*
* # Arguments
* * `img` - A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to apply a laplace effect:
* use photon_rs::conv::laplace;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* laplace(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function laplace(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.laplace(photon_image.ptr);
}

/**
* Preset edge effect.
*
* # Arguments
* * `img` - A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to apply this effect:
* use photon_rs::conv::edge_one;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* edge_one(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function edge_one(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.edge_one(photon_image.ptr);
}

/**
* Apply an emboss effect to an image.
*
* # Arguments
* * `img` - A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to apply an emboss effect:
* use photon_rs::conv::emboss;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* emboss(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function emboss(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.emboss(photon_image.ptr);
}

/**
* Apply a horizontal Sobel filter to an image.
*
* # Arguments
* * `img` - A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to apply a horizontal Sobel filter:
* use photon_rs::conv::sobel_horizontal;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* sobel_horizontal(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function sobel_horizontal(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.sobel_horizontal(photon_image.ptr);
}

/**
* Apply a horizontal Prewitt convolution to an image.
*
* # Arguments
* * `img` - A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to apply a horizontal Prewitt convolution effect:
* use photon_rs::conv::prewitt_horizontal;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* prewitt_horizontal(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function prewitt_horizontal(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.prewitt_horizontal(photon_image.ptr);
}

/**
* Apply a vertical Sobel filter to an image.
*
* # Arguments
* * `img` - A PhotonImage.
*
* # Example
*
* ```no_run
* // For example, to apply a vertical Sobel filter:
* use photon_rs::conv::sobel_vertical;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* sobel_vertical(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function sobel_vertical(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.sobel_vertical(photon_image.ptr);
}

/**
* Alter a select channel by incrementing or decrementing its value by a constant.
*
* # Arguments
* * `img` - A PhotonImage.
* * `channel` - The channel you wish to alter, it should be either 0, 1 or 2,
* representing R, G, or B respectively. (O=Red, 1=Green, 2=Blue)
* * `amount` - The amount to increment/decrement the channel's value by for that pixel.
* A positive value will increment/decrement the channel's value, a negative value will decrement the channel's value.
*
* ## Example
*
* ```no_run
* // For example, to increase the Red channel for all pixels by 10:
* use photon_rs::channels::alter_channel;
* use photon_rs::native::{open_image};
*
* let mut img = open_image("img.jpg").expect("File should open");
* alter_channel(&mut img, 0_usize, 10_i16);
* ```
*
* Adds a constant to a select R, G, or B channel's value.
*
* ### Decrease a channel's value
* // For example, to decrease the Green channel for all pixels by 20:
* ```no_run
* use photon_rs::channels::alter_channel;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* alter_channel(&mut img, 1_usize, -20_i16);
* ```
* **Note**: Note the use of a minus symbol when decreasing the channel.
* @param {PhotonImage} img
* @param {number} channel
* @param {number} amt
*/
export function alter_channel(img, channel, amt) {
    _assertClass(img, PhotonImage);
    wasm.alter_channel(img.ptr, channel, amt);
}

/**
* Increment or decrement every pixel's Red channel by a constant.
*
* # Arguments
* * `img` - A PhotonImage. See the PhotonImage struct for details.
* * `amt` - The amount to increment or decrement the channel's value by for that pixel.
*
* # Example
*
* ```no_run
* // For example, to increase the Red channel for all pixels by 10:
* use photon_rs::channels::alter_red_channel;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* alter_red_channel(&mut img, 10_i16);
* ```
* @param {PhotonImage} photon_image
* @param {number} amt
*/
export function alter_red_channel(photon_image, amt) {
    _assertClass(photon_image, PhotonImage);
    wasm.alter_red_channel(photon_image.ptr, amt);
}

/**
* Increment or decrement every pixel's Green channel by a constant.
*
* # Arguments
* * `img` - A PhotonImage.
* * `amt` - The amount to increment/decrement the channel's value by for that pixel.
*
* # Example
*
* ```no_run
* // For example, to increase the Green channel for all pixels by 20:
* use photon_rs::channels::alter_green_channel;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* alter_green_channel(&mut img, 20_i16);
* ```
* @param {PhotonImage} img
* @param {number} amt
*/
export function alter_green_channel(img, amt) {
    _assertClass(img, PhotonImage);
    wasm.alter_green_channel(img.ptr, amt);
}

/**
* Increment or decrement every pixel's Blue channel by a constant.
*
* # Arguments
* * `img` - A PhotonImage.
* * `amt` - The amount to increment or decrement the channel's value by for that pixel.
*
* # Example
*
* ```no_run
* // For example, to increase the Blue channel for all pixels by 10:
* use photon_rs::channels::alter_blue_channel;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* alter_blue_channel(&mut img, 10_i16);
* ```
* @param {PhotonImage} img
* @param {number} amt
*/
export function alter_blue_channel(img, amt) {
    _assertClass(img, PhotonImage);
    wasm.alter_blue_channel(img.ptr, amt);
}

/**
* Increment/decrement two channels' values simultaneously by adding an amt to each channel per pixel.
*
* # Arguments
* * `img` - A PhotonImage.
* * `channel1` - A usize from 0 to 2 that represents either the R, G or B channels.
* * `amt1` - The amount to increment/decrement the channel's value by for that pixel.
* * `channel2` -A usize from 0 to 2 that represents either the R, G or B channels.
* * `amt2` - The amount to increment/decrement the channel's value by for that pixel.
*
* # Example
*
* ```no_run
* // For example, to increase the values of the Red and Blue channels per pixel:
* use photon_rs::channels::alter_two_channels;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* alter_two_channels(&mut img, 0_usize, 10_i16, 2_usize, 20_i16);
* ```
* @param {PhotonImage} img
* @param {number} channel1
* @param {number} amt1
* @param {number} channel2
* @param {number} amt2
*/
export function alter_two_channels(img, channel1, amt1, channel2, amt2) {
    _assertClass(img, PhotonImage);
    wasm.alter_two_channels(img.ptr, channel1, amt1, channel2, amt2);
}

/**
* Increment all 3 channels' values by adding an amt to each channel per pixel.
*
* # Arguments
* * `img` - A PhotonImage.
* * `r_amt` - The amount to increment/decrement the Red channel by.
* * `g_amt` - The amount to increment/decrement the Green channel by.
* * `b_amt` - The amount to increment/decrement the Blue channel by.
*
* # Example
*
* ```no_run
* // For example, to increase the values of the Red channel by 10, the Green channel by 20,
* // and the Blue channel by 50:
* use photon_rs::channels::alter_channels;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* alter_channels(&mut img, 10_i16, 20_i16, 50_i16);
* ```
* @param {PhotonImage} img
* @param {number} r_amt
* @param {number} g_amt
* @param {number} b_amt
*/
export function alter_channels(img, r_amt, g_amt, b_amt) {
    _assertClass(img, PhotonImage);
    wasm.alter_channels(img.ptr, r_amt, g_amt, b_amt);
}

/**
* Set a certain channel to zero, thus removing the channel's influence in the pixels' final rendered colour.
*
* # Arguments
* * `img` - A PhotonImage.
* * `channel` - The channel to be removed; must be a usize from 0 to 2, with 0 representing Red, 1 representing Green, and 2 representing Blue.
* * `min_filter` - Minimum filter. Value between 0 and 255. Only remove the channel if the current pixel's channel value is less than this minimum filter. To completely
* remove the channel, set this value to 255, to leave the channel as is, set to 0, and to set a channel to zero for a pixel whose red value is greater than 50,
* then channel would be 0 and min_filter would be 50.
*
* # Example
*
* ```no_run
* // For example, to remove the Red channel with a min_filter of 100:
* use photon_rs::channels::remove_channel;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* remove_channel(&mut img, 0_usize, 100_u8);
* ```
* @param {PhotonImage} img
* @param {number} channel
* @param {number} min_filter
*/
export function remove_channel(img, channel, min_filter) {
    _assertClass(img, PhotonImage);
    wasm.remove_channel(img.ptr, channel, min_filter);
}

/**
* Remove the Red channel's influence in an image.
*
* # Arguments
* * `img` - A PhotonImage.
* * `min_filter` - Only remove the channel if the current pixel's channel value is less than this minimum filter.
*
* # Example
*
* ```no_run
* // For example, to remove the red channel for red channel pixel values less than 50:
* use photon_rs::channels::remove_red_channel;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* remove_red_channel(&mut img, 50_u8);
* ```
* @param {PhotonImage} img
* @param {number} min_filter
*/
export function remove_red_channel(img, min_filter) {
    _assertClass(img, PhotonImage);
    wasm.remove_red_channel(img.ptr, min_filter);
}

/**
* Remove the Green channel's influence in an image.
*
* # Arguments
* * `img` - A PhotonImage.
* * `min_filter` - Only remove the channel if the current pixel's channel value is less than this minimum filter.
*
* # Example
*
* ```no_run
* // For example, to remove the green channel for green channel pixel values less than 50:
* use photon_rs::channels::remove_green_channel;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* remove_green_channel(&mut img, 50_u8);
* ```
* @param {PhotonImage} img
* @param {number} min_filter
*/
export function remove_green_channel(img, min_filter) {
    _assertClass(img, PhotonImage);
    wasm.remove_green_channel(img.ptr, min_filter);
}

/**
* Remove the Blue channel's influence in an image.
*
* # Arguments
* * `img` - A PhotonImage.
* * `min_filter` - Only remove the channel if the current pixel's channel value is less than this minimum filter.
*
* # Example
*
* ```no_run
* // For example, to remove the blue channel for blue channel pixel values less than 50:
* use photon_rs::channels::remove_blue_channel;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* remove_blue_channel(&mut img, 50_u8);
* ```
* @param {PhotonImage} img
* @param {number} min_filter
*/
export function remove_blue_channel(img, min_filter) {
    _assertClass(img, PhotonImage);
    wasm.remove_blue_channel(img.ptr, min_filter);
}

/**
* Swap two channels.
*
* # Arguments
* * `img` - A PhotonImage.
* * `channel1` - An index from 0 to 2, representing the Red, Green or Blue channels respectively. Red would be represented by 0, Green by 1, and Blue by 2.
* * `channel2` - An index from 0 to 2, representing the Red, Green or Blue channels respectively. Same as above.
*
* # Example
*
* ```no_run
* // For example, to swap the values of the Red channel with the values of the Blue channel:
* use photon_rs::channels::swap_channels;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* swap_channels(&mut img, 0_usize, 2_usize);
* ```
* @param {PhotonImage} img
* @param {number} channel1
* @param {number} channel2
*/
export function swap_channels(img, channel1, channel2) {
    _assertClass(img, PhotonImage);
    wasm.swap_channels(img.ptr, channel1, channel2);
}

/**
* Invert RGB value of an image.
*
* # Arguments
* * `photon_image` - A DynamicImage that contains a view into the image.
* # Example
*
* ```no_run
* use photon_rs::channels::invert;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* invert(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function invert(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.invert(photon_image.ptr);
}

/**
* Selective hue rotation.
*
* Only rotate the hue of a pixel if its RGB values are within a specified range.
* This function only rotates a pixel's hue to another  if it is visually similar to the colour specified.
* For example, if a user wishes all pixels that are blue to be changed to red, they can selectively specify  only the blue pixels to be changed.
* # Arguments
* * `img` - A PhotonImage.
* * `ref_color` - The `RGB` value of the reference color (to be compared to)
* * `degrees` - The amount of degrees to hue rotate by.
*
* # Example
*
* ```no_run
* // For example, to only rotate the pixels that are of RGB value RGB{20, 40, 60}:
* use photon_rs::Rgb;
* use photon_rs::channels::selective_hue_rotate;
* use photon_rs::native::open_image;
*
* let ref_color = Rgb::new(20_u8, 40_u8, 60_u8);
* let mut img = open_image("img.jpg").expect("File should open");
* selective_hue_rotate(&mut img, ref_color, 180_f32);
* ```
* @param {PhotonImage} photon_image
* @param {Rgb} ref_color
* @param {number} degrees
*/
export function selective_hue_rotate(photon_image, ref_color, degrees) {
    _assertClass(photon_image, PhotonImage);
    _assertClass(ref_color, Rgb);
    var ptr0 = ref_color.__destroy_into_raw();
    wasm.selective_hue_rotate(photon_image.ptr, ptr0, degrees);
}

/**
* Selectively lighten an image.
*
* Only lighten the hue of a pixel if its colour matches or is similar to the RGB colour specified.
* For example, if a user wishes all pixels that are blue to be lightened, they can selectively specify  only the blue pixels to be changed.
* # Arguments
* * `img` - A PhotonImage.
* * `ref_color` - The `RGB` value of the reference color (to be compared to)
* * `amt` - The level from 0 to 1 to lighten the hue by. Increasing by 10% would have an `amt` of 0.1
*
* # Example
*
* ```no_run
* // For example, to only lighten the pixels that are of or similar to RGB value RGB{20, 40, 60}:
* use photon_rs::Rgb;
* use photon_rs::channels::selective_lighten;
* use photon_rs::native::open_image;
*
* let ref_color = Rgb::new(20_u8, 40_u8, 60_u8);
* let mut img = open_image("img.jpg").expect("File should open");
* selective_lighten(&mut img, ref_color, 0.2_f32);
* ```
* @param {PhotonImage} img
* @param {Rgb} ref_color
* @param {number} amt
*/
export function selective_lighten(img, ref_color, amt) {
    _assertClass(img, PhotonImage);
    _assertClass(ref_color, Rgb);
    var ptr0 = ref_color.__destroy_into_raw();
    wasm.selective_lighten(img.ptr, ptr0, amt);
}

/**
* Selectively desaturate pixel colours which are similar to the reference colour provided.
*
* Similarity between two colours is calculated via the CIE76 formula.
* Only desaturates the hue of a pixel if its similarity to the reference colour is within the range in the algorithm.
* For example, if a user wishes all pixels that are blue to be desaturated by 0.1, they can selectively specify  only the blue pixels to be changed.
* # Arguments
* * `img` - A PhotonImage.
* * `ref_color` - The `RGB` value of the reference color (to be compared to)
* * `amt` - The amount of desaturate the colour by.
*
* # Example
*
* ```no_run
* // For example, to only desaturate the pixels that are similar to the RGB value RGB{20, 40, 60}:
* use photon_rs::Rgb;
* use photon_rs::channels::selective_desaturate;
* use photon_rs::native::open_image;
*
* let ref_color = Rgb::new(20_u8, 40_u8, 60_u8);
* let mut img = open_image("img.jpg").expect("File should open");
* selective_desaturate(&mut img, ref_color, 0.1_f32);
* ```
* @param {PhotonImage} img
* @param {Rgb} ref_color
* @param {number} amt
*/
export function selective_desaturate(img, ref_color, amt) {
    _assertClass(img, PhotonImage);
    _assertClass(ref_color, Rgb);
    var ptr0 = ref_color.__destroy_into_raw();
    wasm.selective_desaturate(img.ptr, ptr0, amt);
}

/**
* Selectively saturate pixel colours which are similar to the reference colour provided.
*
* Similarity between two colours is calculated via the CIE76 formula.
* Only saturates the hue of a pixel if its similarity to the reference colour is within the range in the algorithm.
* For example, if a user wishes all pixels that are blue to have an increase in saturation by 10%, they can selectively specify only the blue pixels to be changed.
* # Arguments
* * `img` - A PhotonImage.
* * `ref_color` - The `RGB` value of the reference color (to be compared to)
* * `amt` - The amount of saturate the colour by.
*
* # Example
*
* ```no_run
* // For example, to only increase the saturation of pixels that are similar to the RGB value RGB{20, 40, 60}:
* use photon_rs::Rgb;
* use photon_rs::channels::selective_saturate;
* use photon_rs::native::open_image;
*
* let ref_color = Rgb::new(20_u8, 40_u8, 60_u8);
* let mut img = open_image("img.jpg").expect("File should open");
* selective_saturate(&mut img, ref_color, 0.1_f32);
* ```
* @param {PhotonImage} img
* @param {Rgb} ref_color
* @param {number} amt
*/
export function selective_saturate(img, ref_color, amt) {
    _assertClass(img, PhotonImage);
    _assertClass(ref_color, Rgb);
    var ptr0 = ref_color.__destroy_into_raw();
    wasm.selective_saturate(img.ptr, ptr0, amt);
}

/**
* Selectively changes a pixel to greyscale if it is *not* visually similar or close to the colour specified.
* Only changes the colour of a pixel if its RGB values are within a specified range.
*
* (Similarity between two colours is calculated via the CIE76 formula.)
* For example, if a user wishes all pixels that are *NOT* blue to be displayed in greyscale, they can selectively specify only the blue pixels to be
* kept in the photo.
* # Arguments
* * `img` - A PhotonImage.
* * `ref_color` - The `RGB` value of the reference color (to be compared to)
*
* # Example
*
* ```no_run
* // For example, to greyscale all pixels that are *not* visually similar to the RGB colour RGB{20, 40, 60}:
* use photon_rs::Rgb;
* use photon_rs::channels::selective_greyscale;
* use photon_rs::native::open_image;
*
* let ref_color = Rgb::new(20_u8, 40_u8, 60_u8);
* let mut img = open_image("img.jpg").expect("File should open");
* selective_greyscale(img, ref_color);
* ```
* @param {PhotonImage} photon_image
* @param {Rgb} ref_color
*/
export function selective_greyscale(photon_image, ref_color) {
    _assertClass(photon_image, PhotonImage);
    var ptr0 = photon_image.__destroy_into_raw();
    _assertClass(ref_color, Rgb);
    var ptr1 = ref_color.__destroy_into_raw();
    wasm.selective_greyscale(ptr0, ptr1);
}

/**
* Apply a monochrome effect of a certain colour.
*
* It does so by averaging the R, G, and B values of a pixel, and then adding a
* separate value to that averaged value for each channel to produce a tint.
* # Arguments
* * `photon_image` - A PhotonImage.
* * `r_offset` - The value to add to the Red channel per pixel.
* * `g_offset` - The value to add to the Green channel per pixel.
* * `b_offset` - The value to add to the Blue channel per pixel.
*
* # Example
*
* ```no_run
* // For example, to apply a monochrome effect to an image:
* use photon_rs::monochrome::monochrome;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* monochrome(&mut img, 40_u32, 50_u32, 100_u32);
* ```
* @param {PhotonImage} img
* @param {number} r_offset
* @param {number} g_offset
* @param {number} b_offset
*/
export function monochrome(img, r_offset, g_offset, b_offset) {
    _assertClass(img, PhotonImage);
    wasm.monochrome(img.ptr, r_offset, g_offset, b_offset);
}

/**
* Convert an image to sepia.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* # Example
*
* ```no_run
* // For example, to sepia an image of type `PhotonImage`:
* use photon_rs::monochrome::sepia;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* sepia(&mut img);
* ```
* @param {PhotonImage} img
*/
export function sepia(img) {
    _assertClass(img, PhotonImage);
    wasm.sepia(img.ptr);
}

/**
* Convert an image to grayscale using the conventional averaging algorithm.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* # Example
*
* ```no_run
* // For example, to convert an image of type `PhotonImage` to grayscale:
* use photon_rs::monochrome::grayscale;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* grayscale(&mut img);
* ```
* @param {PhotonImage} img
*/
export function grayscale(img) {
    _assertClass(img, PhotonImage);
    wasm.grayscale(img.ptr);
}

/**
* Convert an image to grayscale with a human corrected factor, to account for human vision.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* # Example
*
* ```no_run
* // For example, to convert an image of type `PhotonImage` to grayscale with a human corrected factor:
* use photon_rs::monochrome::grayscale_human_corrected;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* grayscale_human_corrected(&mut img);
* ```
* @param {PhotonImage} img
*/
export function grayscale_human_corrected(img) {
    _assertClass(img, PhotonImage);
    wasm.grayscale_human_corrected(img.ptr);
}

/**
* Desaturate an image by getting the min/max of each pixel's RGB values.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* # Example
*
* ```no_run
* // For example, to desaturate an image:
* use photon_rs::monochrome::desaturate;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* desaturate(&mut img);
* ```
* @param {PhotonImage} img
*/
export function desaturate(img) {
    _assertClass(img, PhotonImage);
    wasm.desaturate(img.ptr);
}

/**
* Uses a min. decomposition algorithm to convert an image to greyscale.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* # Example
*
* ```no_run
* // For example, to decompose an image with min decomposition:
* use photon_rs::monochrome::decompose_min;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* decompose_min(&mut img);
* ```
* @param {PhotonImage} img
*/
export function decompose_min(img) {
    _assertClass(img, PhotonImage);
    wasm.decompose_min(img.ptr);
}

/**
* Uses a max. decomposition algorithm to convert an image to greyscale.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* # Example
*
* ```no_run
* // For example, to decompose an image with max decomposition:
* use photon_rs::monochrome::decompose_max;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* decompose_max(&mut img);
* ```
* @param {PhotonImage} img
*/
export function decompose_max(img) {
    _assertClass(img, PhotonImage);
    wasm.decompose_max(img.ptr);
}

/**
* Employ only a limited number of gray shades in an image.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* * `num_shades` - The number of grayscale shades to be displayed in the image.
* # Example
*
* ```no_run
* // For example, to limit an image to four shades of gray only:
* use photon_rs::monochrome::grayscale_shades;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* grayscale_shades(&mut img, 4_u8);
* ```
* @param {PhotonImage} photon_image
* @param {number} num_shades
*/
export function grayscale_shades(photon_image, num_shades) {
    _assertClass(photon_image, PhotonImage);
    wasm.grayscale_shades(photon_image.ptr, num_shades);
}

/**
* Convert an image to grayscale by setting a pixel's 3 RGB values to the Red channel's value.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* # Example
*
* ```no_run
* use photon_rs::monochrome::r_grayscale;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* r_grayscale(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function r_grayscale(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.r_grayscale(photon_image.ptr);
}

/**
* Convert an image to grayscale by setting a pixel's 3 RGB values to the Green channel's value.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* # Example
*
* ```no_run
* use photon_rs::monochrome::g_grayscale;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* g_grayscale(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function g_grayscale(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.g_grayscale(photon_image.ptr);
}

/**
* Convert an image to grayscale by setting a pixel's 3 RGB values to the Blue channel's value.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* # Example
*
* ```no_run
* use photon_rs::monochrome::b_grayscale;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* b_grayscale(&mut img);
* ```
* @param {PhotonImage} photon_image
*/
export function b_grayscale(photon_image) {
    _assertClass(photon_image, PhotonImage);
    wasm.b_grayscale(photon_image.ptr);
}

/**
* Convert an image to grayscale by setting a pixel's 3 RGB values to a chosen channel's value.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* * `channel` - A usize representing the channel from 0 to 2. O represents the Red channel, 1 the Green channel, and 2 the Blue channel.
* # Example
* To grayscale using only values from the Red channel:
* ```no_run
* use photon_rs::monochrome::single_channel_grayscale;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* single_channel_grayscale(&mut img, 0_usize);
* ```
* @param {PhotonImage} photon_image
* @param {number} channel
*/
export function single_channel_grayscale(photon_image, channel) {
    _assertClass(photon_image, PhotonImage);
    wasm.single_channel_grayscale(photon_image.ptr, channel);
}

/**
* Threshold an image using a standard thresholding algorithm.
*
* # Arguments
* * `photon_image` - A PhotonImage.
* * `threshold` - The amount the image should be thresholded by from 0 to 255.
* # Example
*
* ```no_run
* // For example, to threshold an image of type `PhotonImage`:
* use photon_rs::monochrome::threshold;
* use photon_rs::native::open_image;
*
* let mut img = open_image("img.jpg").expect("File should open");
* threshold(&mut img, 30_u32);
* ```
* @param {PhotonImage} img
* @param {number} threshold
*/
export function threshold(img, threshold) {
    _assertClass(img, PhotonImage);
    wasm.threshold(img.ptr, threshold);
}

let cachedUint8ClampedMemory0 = null;

function getUint8ClampedMemory0() {
    if (cachedUint8ClampedMemory0 === null || cachedUint8ClampedMemory0.byteLength === 0) {
        cachedUint8ClampedMemory0 = new Uint8ClampedArray(wasm.memory.buffer);
    }
    return cachedUint8ClampedMemory0;
}

function getClampedArrayU8FromWasm0(ptr, len) {
    return getUint8ClampedMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
export class PhotonImage {

    static __wrap(ptr) {
        const obj = Object.create(PhotonImage.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_photonimage_free(ptr);
    }
    /**
    * Create a new PhotonImage from a Vec of u8s, which represent raw pixels.
    * @param {Uint8Array} raw_pixels
    * @param {number} width
    * @param {number} height
    */
    constructor(raw_pixels, width, height) {
        const ptr0 = passArray8ToWasm0(raw_pixels, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.photonimage_new(ptr0, len0, width, height);
        return PhotonImage.__wrap(ret);
    }
    /**
    * Create a new PhotonImage from a base64 string.
    * @param {string} base64
    * @returns {PhotonImage}
    */
    static new_from_base64(base64) {
        const ptr0 = passStringToWasm0(base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.base64_to_image(ptr0, len0);
        return PhotonImage.__wrap(ret);
    }
    /**
    * Create a new PhotonImage from a byteslice.
    * @param {Uint8Array} vec
    * @returns {PhotonImage}
    */
    static new_from_byteslice(vec) {
        const ptr0 = passArray8ToWasm0(vec, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.photonimage_new_from_byteslice(ptr0, len0);
        return PhotonImage.__wrap(ret);
    }
    /**
    * Get the width of the PhotonImage.
    * @returns {number}
    */
    get_width() {
        const ret = wasm.photonimage_get_width(this.ptr);
        return ret >>> 0;
    }
    /**
    * Get the PhotonImage's pixels as a Vec of u8s.
    * @returns {Uint8Array}
    */
    get_raw_pixels() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.photonimage_get_raw_pixels(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Get the height of the PhotonImage.
    * @returns {number}
    */
    get_height() {
        const ret = wasm.photonimage_get_height(this.ptr);
        return ret >>> 0;
    }
    /**
    * Convert the PhotonImage to base64.
    * @returns {string}
    */
    get_base64() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.photonimage_get_base64(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Convert the PhotonImage's raw pixels to JS-compatible ImageData.
    * @returns {ImageData}
    */
    get_image_data() {
        const ret = wasm.photonimage_get_image_data(this.ptr);
        return takeObject(ret);
    }
    /**
    * Convert ImageData to raw pixels, and update the PhotonImage's raw pixels to this.
    * @param {ImageData} img_data
    */
    set_imgdata(img_data) {
        wasm.photonimage_set_imgdata(this.ptr, addHeapObject(img_data));
    }
}
/**
*/
export class Rgb {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rgb_free(ptr);
    }
}

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbg_width_e408b5e1aec32fe7(arg0) {
    const ret = getObject(arg0).width;
    return ret;
};

export function __wbg_height_4533f1086c6d4837(arg0) {
    const ret = getObject(arg0).height;
    return ret;
};

export function __wbg_data_ba126c289535c14a(arg0, arg1) {
    const ret = getObject(arg1).data;
    const ptr0 = passArray8ToWasm0(ret, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_newwithu8clampedarrayandsh_5983a7df9463fed0() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0, arg3 >>> 0);
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

