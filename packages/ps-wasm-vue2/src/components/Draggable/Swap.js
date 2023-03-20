// import {
//   toggleClass,
//   index
// } from '../../src/utils.js';
import Sortable from "sortablejs"

const toggleClass = Sortable.utils.toggleClass
const index = Sortable.utils.index

let lastSwapEl;


function SwapPlugin() {
  function Swap() {
    this.defaults = {
      insertUpClass: 'sortable-insert-up-highlight',
      insertDownClass: 'sortable-insert-down-highlight'
    };
  }

  Swap.prototype = {
    dragStart({ dragEl }) {
      lastSwapEl = dragEl;
    },
    cleanCss() {
      const {insertUpClass, insertDownClass} = this.options
      toggleClass(lastSwapEl, insertUpClass, false);
      toggleClass(lastSwapEl, insertDownClass, false);
    },
    dragOver(e) {
      const { completed, target, onMove, activeSortable, changed, cancel, originalEvent } = e
      if (lastSwapEl) {
        const { clientY } = originalEvent
        const {y, height} = lastSwapEl.getBoundingClientRect()
        if (clientY > y + height || clientY < y) {
          this.cleanCss()
        }
      }
    },
    dragOverValid(e) {
      const {insertUpClass, insertDownClass} = this.options
      const { completed, target, dragEl, onMove, activeSortable, changed, cancel, originalEvent } = e

      if (!activeSortable.options.swap) return;
      let el = this.sortable.el,
        options = this.options;
      if (target && target !== el) {
        const { clientY } = originalEvent
        const {y, height} = target.getBoundingClientRect()
        const {y: dragElY, height: dragElHeight } = dragEl.getBoundingClientRect()
        let prevSwapEl = lastSwapEl;
        const downOrNot = clientY > y + (height / 2)
        const className = downOrNot ? insertDownClass : insertUpClass
        // const otherClassName = className === 'down' ? 'up' : 'down'
        if (onMove(target) !== false) {
          // toggleClass(target, options.swapClass, true);
          this.cleanCss()
          if (!((Math.abs((y + height) - dragElY) < 8 && downOrNot) || (Math.abs((dragElY + dragElHeight) - y) < 8 && !downOrNot))) {
            toggleClass(target, className, true);
          }
          lastSwapEl = target;
        } else {
          lastSwapEl = null;
        }

        if (prevSwapEl && prevSwapEl !== lastSwapEl) {
          // toggleClass(prevSwapEl, options.swapClass, false);
          this.cleanCss()
        }
      }
      changed();

      completed(true);
      cancel();
    },
    drop({ activeSortable, putSortable, dragEl }) {
      let toSortable = (putSortable || this.sortable);
      let options = this.options;
      lastSwapEl && toggleClass(lastSwapEl, options.swapClass, false);
      if (lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
        if (dragEl !== lastSwapEl) {
          toSortable.captureAnimationState();
          if (toSortable !== activeSortable) activeSortable.captureAnimationState();
          swapNodes(dragEl, lastSwapEl, options);

          toSortable.animateAll();
          if (toSortable !== activeSortable) activeSortable.animateAll();
        }
      }
      this.cleanCss()
    },
    nulling() {
      lastSwapEl = null;
    }
  };

  return Object.assign(Swap, {
    pluginName: 'swap',
    eventProperties() {
      return {
        swapItem: lastSwapEl
      };
    }
  });
}


function swapNodes(n1, n2, options) {
  let p1 = n1.parentNode,
    p2 = n2.parentNode,
    i1, i2;

  if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;

  i1 = index(n1)
  i2 = index(n2)

  if (p1.isEqualNode(p2) && i1 < i2) {
    i2++;
  }
  const {insertUpClass, insertDownClass} = options
  if (n2.classList.contains(insertUpClass)) {
    p2.insertBefore(n1, p2.children[i2]);
    console.log('insertBefore: ', n1, p2.children[i2], i2)
  } else if (n2.classList.contains(insertDownClass)) {
    p2.insertBefore(n1, p2.children[i2 + 1]);
    console.log('insertBefore: ', n1, p2.children[i2 + 1], (i2 + 1))
  }
  // p1.insertBefore(n2, p1.children[i1]);
  // p2.insertBefore(n1, p2.children[i2]);
}

export default SwapPlugin;
