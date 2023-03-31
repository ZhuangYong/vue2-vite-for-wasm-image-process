import { post } from './request.js'

const register = (data) => post('/api/register', data)

const login1 = (data) => post('/api/login1', data)

const login2 = (data) => post('/api/login2', data)

const sentcaptcha = (data) => post('/api/sentcaptcha', data)

const getuserinfo = () => post('/api/getuserinfo')

const changepwd = (data) => post('/api/changepwd', data)

const findpass = (data) => post('/api/findpass', data)

const uploadfiles = (data) => post('/api/uploadfiles', data)

const changeuserinfo = (data) => post('/api/changeuserinfo', data)

const addxueke = (data) => post('/api/addxueke', data)

const getxueke = (data) => post('/api/getxueke', data)

const delxueke = (data) => post('/api/delxueke', data)

const updatexueke = (data) => post('/api/updatexueke', data)

const getbanji = (data) => post('/api/getbanji', data)

const updatebanji = (data) => post('/api/updatebanji', data)

const addbanji = (data) => post('/api/addbanji', data)

const getusers = (data) => post('/api/getusers', data)

const delbanji = (data) => post('/api/delbanji', data)

const annoadd = (data) => post('/api/annoadd', data)

const annolist = (data) => post('/api/annolist', data)

const annodel = (data) => post('/api/annodel', data)

const annoupdate = (data) => post('/api/annoupdate', data)

const addxm = (data) => post('/api/addxm', data)

const getxm = (data) => post('/api/getxm', data)

const delxm = (data) => post('/api/delxm', data)

const updatexm = (data) => post('/api/updatexm', data)

const updateuserbanji = (data) => post('/api/updateuserbanji', data)

// const uploadproject = (data) => post('/api/uploadproject', data)

const addxmlist = (data) => post('/api/addxmlist', data)

const getxmlistbyuser = (data) => post('/api/getxmlistbyuser', data)

const deluserxm = (data) => post('/api/deluserxm', data)

const updataxmlist = (data) => post('/api/updataxmlist', data)

const getbanjibyteacher = (data) => post('/api/getbanjibyteacher', data)

const updataxms = (data) => post('/api/updataxms', data)

export {
  register,
  login1,
  login2,
  sentcaptcha,
  getuserinfo,
  changepwd,
  findpass,
  uploadfiles,
  changeuserinfo,
  addxueke,
  getxueke,
  delxueke,
  updatexueke,
  getbanji,
  updatebanji,
  addbanji,
  getusers,
  delbanji,
  annoadd,
  annolist,
  annodel,
  annoupdate,
  addxm,
  getxm,
  delxm,
  updatexm,
  updateuserbanji,
  addxmlist,
  getxmlistbyuser,
  deluserxm,
  updataxmlist,
  getbanjibyteacher,
  updataxms
}