/* tslint:disable */
/* eslint-disable */
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
export function offset(photon_image: PhotonImage, channel_index: number, offset: number): void;
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
export function offset_red(img: PhotonImage, offset_amt: number): void;
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
export function offset_green(img: PhotonImage, offset_amt: number): void;
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
export function offset_blue(img: PhotonImage, offset_amt: number): void;
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
export function multiple_offsets(photon_image: PhotonImage, offset: number, channel_index: number, channel_index2: number): void;
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
export function primary(img: PhotonImage): void;
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
export function colorize(photon_image: PhotonImage): void;
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
export function solarize(photon_image: PhotonImage): void;
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
export function solarize_retimg(photon_image: PhotonImage): PhotonImage;
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
export function inc_brightness(photon_image: PhotonImage, brightness: number): void;
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
export function adjust_contrast(photon_image: PhotonImage, contrast: number): void;
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
export function tint(photon_image: PhotonImage, r_offset: number, g_offset: number, b_offset: number): void;
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
export function horizontal_strips(photon_image: PhotonImage, num_strips: number): void;
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
export function color_horizontal_strips(photon_image: PhotonImage, num_strips: number, color: Rgb): void;
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
export function vertical_strips(photon_image: PhotonImage, num_strips: number): void;
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
export function color_vertical_strips(photon_image: PhotonImage, num_strips: number, color: Rgb): void;
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
export function oil(photon_image: PhotonImage, radius: number, intensity: number): void;
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
export function frosted_glass(photon_image: PhotonImage): void;
/**
* @param {string} base64
* @returns {PhotonImage}
*/
export function base64_to_image(base64: string): PhotonImage;
/**
* Convert ImageData to a raw pixel vec of u8s.
* @param {ImageData} imgdata
* @returns {Uint8Array}
*/
export function to_raw_pixels(imgdata: ImageData): Uint8Array;
/**
* Convert a base64 string to a Vec of u8s.
* @param {string} base64
* @returns {Uint8Array}
*/
export function base64_to_vec(base64: string): Uint8Array;
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
export function lch(photon_image: PhotonImage, mode: string, amt: number): void;
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
export function hsl(photon_image: PhotonImage, mode: string, amt: number): void;
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
export function hsv(photon_image: PhotonImage, mode: string, amt: number): void;
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
export function hue_rotate_hsl(img: PhotonImage, degrees: number): void;
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
export function hue_rotate_hsv(img: PhotonImage, degrees: number): void;
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
export function hue_rotate_lch(img: PhotonImage, degrees: number): void;
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
export function saturate_hsl(img: PhotonImage, level: number): void;
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
export function saturate_lch(img: PhotonImage, level: number): void;
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
export function saturate_hsv(img: PhotonImage, level: number): void;
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
export function lighten_lch(img: PhotonImage, level: number): void;
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
export function lighten_hsl(img: PhotonImage, level: number): void;
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
export function lighten_hsv(img: PhotonImage, level: number): void;
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
export function darken_lch(img: PhotonImage, level: number): void;
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
export function darken_hsl(img: PhotonImage, level: number): void;
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
export function darken_hsv(img: PhotonImage, level: number): void;
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
export function desaturate_hsv(img: PhotonImage, level: number): void;
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
export function desaturate_hsl(img: PhotonImage, level: number): void;
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
export function desaturate_lch(img: PhotonImage, level: number): void;
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
export function mix_with_colour(photon_image: PhotonImage, mix_colour: Rgb, opacity: number): void;
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
export function noise_reduction(photon_image: PhotonImage): void;
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
export function sharpen(photon_image: PhotonImage): void;
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
export function edge_detection(photon_image: PhotonImage): void;
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
export function identity(photon_image: PhotonImage): void;
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
export function box_blur(photon_image: PhotonImage): void;
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
export function gaussian_blur(photon_image: PhotonImage, radius: number): void;
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
export function detect_horizontal_lines(photon_image: PhotonImage): void;
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
export function detect_vertical_lines(photon_image: PhotonImage): void;
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
export function detect_45_deg_lines(photon_image: PhotonImage): void;
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
export function detect_135_deg_lines(photon_image: PhotonImage): void;
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
export function laplace(photon_image: PhotonImage): void;
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
export function edge_one(photon_image: PhotonImage): void;
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
export function emboss(photon_image: PhotonImage): void;
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
export function sobel_horizontal(photon_image: PhotonImage): void;
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
export function prewitt_horizontal(photon_image: PhotonImage): void;
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
export function sobel_vertical(photon_image: PhotonImage): void;
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
export function alter_channel(img: PhotonImage, channel: number, amt: number): void;
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
export function alter_red_channel(photon_image: PhotonImage, amt: number): void;
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
export function alter_green_channel(img: PhotonImage, amt: number): void;
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
export function alter_blue_channel(img: PhotonImage, amt: number): void;
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
export function alter_two_channels(img: PhotonImage, channel1: number, amt1: number, channel2: number, amt2: number): void;
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
export function alter_channels(img: PhotonImage, r_amt: number, g_amt: number, b_amt: number): void;
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
export function remove_channel(img: PhotonImage, channel: number, min_filter: number): void;
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
export function remove_red_channel(img: PhotonImage, min_filter: number): void;
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
export function remove_green_channel(img: PhotonImage, min_filter: number): void;
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
export function remove_blue_channel(img: PhotonImage, min_filter: number): void;
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
export function swap_channels(img: PhotonImage, channel1: number, channel2: number): void;
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
export function invert(photon_image: PhotonImage): void;
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
export function selective_hue_rotate(photon_image: PhotonImage, ref_color: Rgb, degrees: number): void;
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
export function selective_lighten(img: PhotonImage, ref_color: Rgb, amt: number): void;
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
export function selective_desaturate(img: PhotonImage, ref_color: Rgb, amt: number): void;
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
export function selective_saturate(img: PhotonImage, ref_color: Rgb, amt: number): void;
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
export function selective_greyscale(photon_image: PhotonImage, ref_color: Rgb): void;
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
export function monochrome(img: PhotonImage, r_offset: number, g_offset: number, b_offset: number): void;
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
export function sepia(img: PhotonImage): void;
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
export function grayscale(img: PhotonImage): void;
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
export function grayscale_human_corrected(img: PhotonImage): void;
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
export function desaturate(img: PhotonImage): void;
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
export function decompose_min(img: PhotonImage): void;
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
export function decompose_max(img: PhotonImage): void;
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
export function grayscale_shades(photon_image: PhotonImage, num_shades: number): void;
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
export function r_grayscale(photon_image: PhotonImage): void;
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
export function g_grayscale(photon_image: PhotonImage): void;
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
export function b_grayscale(photon_image: PhotonImage): void;
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
export function single_channel_grayscale(photon_image: PhotonImage, channel: number): void;
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
export function threshold(img: PhotonImage, threshold: number): void;
/**
*/
export class PhotonImage {
  free(): void;
/**
* Create a new PhotonImage from a Vec of u8s, which represent raw pixels.
* @param {Uint8Array} raw_pixels
* @param {number} width
* @param {number} height
*/
  constructor(raw_pixels: Uint8Array, width: number, height: number);
/**
* Create a new PhotonImage from a base64 string.
* @param {string} base64
* @returns {PhotonImage}
*/
  static new_from_base64(base64: string): PhotonImage;
/**
* Create a new PhotonImage from a byteslice.
* @param {Uint8Array} vec
* @returns {PhotonImage}
*/
  static new_from_byteslice(vec: Uint8Array): PhotonImage;
/**
* Get the width of the PhotonImage.
* @returns {number}
*/
  get_width(): number;
/**
* Get the PhotonImage's pixels as a Vec of u8s.
* @returns {Uint8Array}
*/
  get_raw_pixels(): Uint8Array;
/**
* Get the height of the PhotonImage.
* @returns {number}
*/
  get_height(): number;
/**
* Convert the PhotonImage to base64.
* @returns {string}
*/
  get_base64(): string;
/**
* Convert the PhotonImage's raw pixels to JS-compatible ImageData.
* @returns {ImageData}
*/
  get_image_data(): ImageData;
/**
* Convert ImageData to raw pixels, and update the PhotonImage's raw pixels to this.
* @param {ImageData} img_data
*/
  set_imgdata(img_data: ImageData): void;
}
/**
*/
export class Rgb {
  free(): void;
}
