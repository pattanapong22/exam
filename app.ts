import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

//hello 0/
app.get('/', (req, res) => {
  res.send('d kub p pom pattanapong plesae read README.md in GitHub nakub<3 Let me hope I pass this internship');
});

//show order with filter and pageination 
 app.get('/order', async (req, res) => {
  const { status, s, page =1 , limit=5 } = req.query; 
  const where: any = {};
  if (status) {          
    where.status = status;
  }
  if (s) {              
    where.OR = [
      { name: { contains: s as string, mode: 'insensitive' } },
      { email: { contains: s as string, mode: 'insensitive' } },
      { product: { contains: s as string, mode: 'insensitive' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const orders = await prisma.order.findMany({where, skip, take:Number(limit), });
 
  res.json({page ,limit ,data: orders });
});

//see 1 order 
app.get('/order/:id', async (req, res) => {
  const {id} = req.params;  
  const order = await prisma.order.findUnique({ 
    where: { id: String(id) },
  }); 
  res.send(order);
});

//post create order 
app.post('/order/create', async (req, res) => {
  const {name, email, price, status, product } = req.body;
  const newOrder = await prisma.order.create ({
    data: {name,email,product,price,status,},
  });
  res.status(200).json({
    message: 'complete',
    data: newOrder,
  });
});

//edit 
app.put('/order/edit/:id', async (req, res) => {
  const {id} = req.params;
  const {name, email, price, product} = req.body;
  const updateOrder = await prisma.order.update({
      where: {id:(id)},
      data: {name, email, price, product}
    });
      res.status(200).json({ 
        message: 'edit complete',
        data: updateOrder
    });
});

//edit status 
app.put('/order/edit/status/:id', async (req, res) => {
  const {id} = req.params;
  const {status} = req.body;
  const updateStatus = await prisma.order.update({
    where: {id:(id)},
    data: {status}
  });
  res.status(200).json({
    message: 'edit status complete',
    data: updateStatus
  });
});

//delete order 
app.delete('/order/delete/:id', async (req, res) => {
  const { id } = req.params;
  const deletedOrder = await prisma.order.delete({
    where: { id:(id) },
  });
  res.status(200).json({
    message: 'delete complete',
    data: deletedOrder,
  });
});

//set port 
app.listen(3000, () => {
  console.log('server on port 3000');
});