import bcrypt from 'bcrypt'

const plainPassword = 'mypass123'
const plainPassword2 = 'mypass123'

const hasedpassword = await bcrypt.hash(plainPassword, 10)

const hasedpassword2 = await bcrypt.hash(plainPassword, 10)


console.log(hasedpassword);


const isMatch = await bcrypt.compare(plainPassword2, hasedpassword)
console.log(isMatch) // should print true

const isMatch2 = await bcrypt.compare('wrongpassword', hasedpassword)
console.log(isMatch2) // should print false