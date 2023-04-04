import stage from "./stage.vue"
import ImageHelper, {COMMAND_TYPES} from "@/utils/ImageHelper"
import Event from '@/utils/Event'
import * as Utils from '@/utils'
import * as FontHelper from '@/utils/FontHelper'
import Const from "@/const"
import {fabric} from '@/lib/fabric.min'
import Draggable from '@/components/Draggable'
import Swap from "@/components/Draggable/Swap";
import BaseFabricComponent from '@/components/BaseFabricComponent'
import fabricEnhance from "@/utils/fabricEnhance"

fabricEnhance(fabric)
export { fabric, ImageHelper, stage, FontHelper, Utils, Event, BaseFabricComponent, Draggable, Swap, Const, COMMAND_TYPES }
