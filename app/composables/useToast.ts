const toastMessage = ref('')
const toastVisible = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
export const useToast = () => {
  const showToast = (message: string) => {
    toastMessage.value = message; toastVisible.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { toastVisible.value = false }, 2200)
  }
  return { toastMessage, toastVisible, showToast }
}
