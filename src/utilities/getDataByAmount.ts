export function getDataByAmount (args: {
  amount?: number
  query: string
  params: unknown[]
  page?: number
}) {
  let amount = args.amount
  let page = args.page ?? 1

  if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
    amount = undefined
  }

  if (isNaN(page) || page < 1) {
    page = 1
  }

  const offset = amount ? (page - 1) * amount : 0

  let query = args.query
  let params = [...args.params]

  if (amount !== undefined) {
    query += ' LIMIT ? OFFSET ?'
    params.push(amount, offset)
  }

  return { query, params }
}
