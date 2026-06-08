// Character Counter Logic
export const countLetters = (text) => {
  return text.length
}

export const countWords = (text) => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

export const countChars = (text) => {
  return text.replace(/\s/g, '').length
}

export const countSentences = (text) => {
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0)
  return sentences.length
}

export const countParagraphs = (text) => {
  return text.split(/\n+/).filter(para => para.trim().length > 0).length
}
