export default function CheckBomb(target, array) {
  return array.some((subArray) =>
    subArray.some((item) => item.i === target.i && item.j === target.j)
  )
}