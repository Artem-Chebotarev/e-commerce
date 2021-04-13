require('dotenv').config()

const express = require("express");
const cors = require("cors");
const path = require('path');
const fileupload = require("express-fileupload");
const { dbConnect } = require("./src/db/connect");
const GoodModel = require("./src/models/good.model");
const CategoryModel = require("./src/models/category.model")

const authRouter = require('./src/routes/auth.routes');
const filesRouter = require('./src/routes/file.routes');
const UserModel = require('./src/models/user.model');
const OrderModel = require('./src/models/order.model');

const app = express();

const { PORT } = process.env

dbConnect();

app.use(cors());
app.use(express.json());
app.use(fileupload());
app.use(express.static(path.join(__dirname, 'static')))
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/files', filesRouter);

app.get("/api/v1/", async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.json(categories);
  } catch (error) {
    res.sendStatus(500)
  }
});

app.get("/api/v1/categories/:id", async (req, res) => {
  try {
    const goods = await GoodModel.find({ category: req.params.id })
    res.json(goods)
  } catch (error) {
    res.sendStatus(500)
  }
})

app.get("/api/v1/goods/:id", async (req, res) => {
  try {
    const { id } = req.params
    const good = await GoodModel.findById(id)
    res.json(good)
  } catch (error) {
    res.sendStatus(500)
  }
})

app.patch("/api/v1/goods", async (req, res) => {
  try {
    const { goods } = req.body
    console.log(goods)
  } catch (error) {
    res.sendStatus(500)
  }
})

app.post("/api/v1/order", async (req, res) => {
  try {
    console.log("req.body------------->", req.body)
    const orderForUser = {...req.body, currentUser: true}
    const {
      fioToServer,
      addressToServer,
      email,
      phone,
      card,
      cardName,
      expMonth,
      expYear,
      cvv,
      currentCart,
      currentUser} = req.body
      await UserModel.findByIdAndUpdate(req.body.currentUser.id,
        {$push:  {orders: orderForUser}})
      await OrderModel.create({
        fio: fioToServer,
        address: addressToServer,
        email: email,
        phone: phone,
        card: card,
        cardName: cardName,
        expMonth: expMonth,
        expYear: expYear,
        cvv: cvv,
        cart: currentCart,
        user: currentUser.id,
      })


    currentCart.map(async el => {
      console.log(el.name,'---->', el.quantity)
      const doc = await GoodModel.findById(el._id)
      console.log('doc------------>', doc)

      if (doc.quantity - el.quantity < 0) {
       return
      } else {
        await GoodModel.findOneAndUpdate({_id: el._id}, {$inc: {quantity: -el.quantity}})
      }
      return
    })
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

app.post("/api/v1/add_new_good", async (req, res) => {
  try {
    const {name, quantity, price, description, category, photo, rating, user} = req.body
    const newGood = await GoodModel.create({
      quantity :quantity,
      photo: [photo],
      name: name,
      description: description,
      price: price,
      rating: rating,
      category: category,
})
    await UserModel.findByIdAndUpdate(user, {$push: {goods: newGood._id}})
      res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

app.get("/api/v1/filter", async (req, res) => {
  try {
    const {_c: category, _s: input} = req.query
    const good = await GoodModel.find({name: new RegExp(`^${input}.*`, 'ig'), category: category})
    good.length ? res.status(200).json(good) : res.sendStatus(404)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

const root = require('path').join(__dirname, '../', 'client', 'build');
app.use(express.static(root));
app.get('*', (req, res) => {
  res.sendFile('index.html', { root });
});

app.listen(PORT, () => {
  console.log('Server started on port ', PORT)
})
