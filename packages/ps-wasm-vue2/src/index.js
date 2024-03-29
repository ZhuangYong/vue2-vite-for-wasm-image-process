import stage from "./stage.vue"
import imageHelper, {COMMAND_TYPES} from "@/utils/ImageHelper"
import timeLinePlayer from "@/utils/TimeLinePlayer"
import Event from '@/utils/Event'
import * as Utils from '@/utils'
import * as FontHelper from '@/utils/FontHelper'
import Const from "@/const"
import {fabric} from '@/lib/fabric.min'
import Draggable from '@/components/Draggable'
import Swap from "@/components/Draggable/Swap";
import BaseFabricComponent from '@/components/BaseFabricComponent'
import fabricEnhance from "@/utils/fabricEnhance"
import Rectangle from "@/Rectangle"
import * as filters from '@/filters'
import animates from '@/animate'

fabricEnhance(fabric)
export {
  animates,
  fabric,
  imageHelper,
  timeLinePlayer,
  stage,
  FontHelper,
  Utils,
  Event,
  BaseFabricComponent,
  Draggable,
  Swap,
  Const,
  filters,
  COMMAND_TYPES,
  Rectangle
}
