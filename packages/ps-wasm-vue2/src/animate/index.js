import Shake from "@/animate/Shake"
import Scale from "@/animate/Scale"
import Spark from "@/animate/Spark"

export default [
  { key: 'shake', label: Shake.name, Constructor: Shake},
  { key: 'scale', label: Scale.name, Constructor: Scale},
  { key: 'spark', label: Spark.name, Constructor: Spark},
  // { key: '渐变', label: Shake.name, Constructor: Shake},
  // { key: '故障', label: Scale.name, Constructor: Scale},
  // { key: '打字', label: Spark.name, Constructor: Spark}
]