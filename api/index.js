import "./chunk-MCKGQKYU.js";

// src/app.ts
import express9 from "express";
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  // output   = "../generated/prisma"\n  output   = "../src/generated"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum Role {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nenum OrderStatus {\n  PLACED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel User {\n  id       String  @id @default(uuid())\n  name     String\n  email    String  @unique\n  password String?\n  role     Role    @default(CUSTOMER)\n  isBanned Boolean @default(false)\n\n  //  Relation\n  medicines Medicine[] @relation("SellerMedicines") //one to many. One seller (user) can sell many Medicine[]\n  orders    Order[]    @relation("CustomerOrders") //one to many. One Customer (user) has many Order[]\n  reviews   Review[] //one to many. One customer(user) has many Review[]\n  cart      Cart?\n\n  phone   String?\n  address String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  emailVerified Boolean   @default(false)\n  image         String?\n  sessions      Session[]\n  accounts      Account[]\n\n  @@map("users")\n}\n\nmodel Category {\n  id   String @id @default(uuid())\n  name String @unique\n\n  //  Relation\n  medicines Medicine[] //One to many. One Category has many Medicine[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("categories")\n}\n\nmodel Medicine {\n  id           String  @id @default(uuid())\n  name         String\n  description  String\n  price        Decimal @db.Decimal(10, 2)\n  stock        Int\n  manufacturer String\n  imageURL     String?\n\n  //  Relation\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  sellerId String\n  seller   User   @relation("SellerMedicines", fields: [sellerId], references: [id], onDelete: Cascade)\n\n  reviews    Review[]\n  orderItems OrderItem[]\n  cartItems  CartItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([categoryId])\n  @@index([sellerId])\n  @@index([name])\n  @@map("medicines")\n}\n\nmodel Order {\n  id              String      @id @default(uuid())\n  totalAmount     Decimal     @db.Decimal(10, 2)\n  shippingAddress String\n  status          OrderStatus @default(PLACED)\n\n  //Relation\n\n  customerId String\n  customer   User   @relation("CustomerOrders", fields: [customerId], references: [id], onDelete: Cascade)\n\n  orderItems OrderItem[] //One to Many. One Order has many order items. \n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([customerId])\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id       String  @id @default(uuid())\n  quantity Int\n  price    Decimal @db.Decimal(10, 2)\n\n  orderId String\n  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade) //Many to one. Many order items are in one order.\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade) //Many to one. Many order items are in One medicine\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([orderId, medicineId])\n  @@map("orderItems")\n}\n\nmodel Review {\n  id      String  @id @default(uuid())\n  rating  Int\n  comment String?\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade) //Many to One. One user has many reviews\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade) //Many to one. One medicine has many reviews\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId, medicineId])\n  @@map("reviews")\n}\n\nmodel Cart {\n  id        String     @id @default(uuid())\n  userId    String     @unique\n  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)\n  cartItems CartItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("carts")\n}\n\nmodel CartItem {\n  id         String   @id @default(uuid())\n  cartId     String\n  cart       Cart     @relation(fields: [cartId], references: [id])\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  quantity   Int\n\n  @@map("cartItems")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"isBanned","kind":"scalar","type":"Boolean"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"SellerMedicines"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"}],"dbName":"users"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"categories"},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"imageURL","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"SellerMedicines"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"medicines"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"orderItems"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"carts"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"CartItemToMedicine"},{"name":"quantity","kind":"scalar","type":"Int"}],"dbName":"cartItems"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","medicines","_count","category","seller","user","medicine","reviews","customer","orderItems","order","cartItems","cart","orders","sessions","accounts","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Medicine.findUnique","Medicine.findUniqueOrThrow","Medicine.findFirst","Medicine.findFirstOrThrow","Medicine.findMany","Medicine.createOne","Medicine.createMany","Medicine.createManyAndReturn","Medicine.updateOne","Medicine.updateMany","Medicine.updateManyAndReturn","Medicine.upsertOne","Medicine.deleteOne","Medicine.deleteMany","_avg","_sum","Medicine.groupBy","Medicine.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Cart.findUnique","Cart.findUniqueOrThrow","Cart.findFirst","Cart.findFirstOrThrow","Cart.findMany","Cart.createOne","Cart.createMany","Cart.createManyAndReturn","Cart.updateOne","Cart.updateMany","Cart.updateManyAndReturn","Cart.upsertOne","Cart.deleteOne","Cart.deleteMany","Cart.groupBy","Cart.aggregate","CartItem.findUnique","CartItem.findUniqueOrThrow","CartItem.findFirst","CartItem.findFirstOrThrow","CartItem.findMany","CartItem.createOne","CartItem.createMany","CartItem.createManyAndReturn","CartItem.updateOne","CartItem.updateMany","CartItem.updateManyAndReturn","CartItem.upsertOne","CartItem.deleteOne","CartItem.deleteMany","CartItem.groupBy","CartItem.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","AND","OR","NOT","id","identifier","value","expiresAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","accountId","providerId","userId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","cartId","medicineId","quantity","every","some","none","rating","comment","price","orderId","totalAmount","shippingAddress","OrderStatus","status","customerId","name","description","stock","manufacturer","imageURL","categoryId","sellerId","email","Role","role","isBanned","phone","address","emailVerified","image","orderId_medicineId","userId_medicineId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "qgVosAEVAwAA0wIAIAkAAOACACAOAADhAgAgDwAA3wIAIBAAAOICACARAADjAgAgygEAANsCADDLAQAAMQAQzAEAANsCADDNAQEAAAAB0QFAALUCACHSAUAAtQIAIecBAQDcAgAh-gEBALQCACGBAgEAAAABgwIAAN0CgwIihAIgAN4CACGFAgEA3AIAIYYCAQDcAgAhhwIgAN4CACGIAgEA3AIAIQEAAAABACATBQAA9QIAIAYAAMUCACAJAADgAgAgCwAA6gIAIA0AAMYCACDKAQAA9AIAMMsBAAADABDMAQAA9AIAMM0BAQC0AgAh0QFAALUCACHSAUAAtQIAIfMBEADoAgAh-gEBALQCACH7AQEAtAIAIfwBAgDsAgAh_QEBALQCACH-AQEA3AIAIf8BAQC0AgAhgAIBALQCACEGBQAA4wQAIAYAAKUDACAJAADcBAAgCwAA4AQAIA0AAKYDACD-AQAA-wIAIBMFAAD1AgAgBgAAxQIAIAkAAOACACALAADqAgAgDQAAxgIAIMoBAAD0AgAwywEAAAMAEMwBAAD0AgAwzQEBAAAAAdEBQAC1AgAh0gFAALUCACHzARAA6AIAIfoBAQC0AgAh-wEBALQCACH8AQIA7AIAIf0BAQC0AgAh_gEBANwCACH_AQEAtAIAIYACAQC0AgAhAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACABAAAAAwAgDAcAAMUCACAIAADuAgAgygEAAPMCADDLAQAACQAQzAEAAPMCADDNAQEAtAIAIdEBQAC1AgAh0gFAALUCACHgAQEAtAIAIewBAQC0AgAh8QECAOwCACHyAQEA3AIAIQMHAAClAwAgCAAA4QQAIPIBAAD7AgAgDQcAAMUCACAIAADuAgAgygEAAPMCADDLAQAACQAQzAEAAPMCADDNAQEAAAAB0QFAALUCACHSAUAAtQIAIeABAQC0AgAh7AEBALQCACHxAQIA7AIAIfIBAQDcAgAhigIAAPICACADAAAACQAgAQAACgAwAgAACwAgDAgAAO4CACAMAADxAgAgygEAAPACADDLAQAADQAQzAEAAPACADDNAQEAtAIAIdEBQAC1AgAh0gFAALUCACHsAQEAtAIAIe0BAgDsAgAh8wEQAOgCACH0AQEAtAIAIQIIAADhBAAgDAAA4gQAIA0IAADuAgAgDAAA8QIAIMoBAADwAgAwywEAAA0AEMwBAADwAgAwzQEBAAAAAdEBQAC1AgAh0gFAALUCACHsAQEAtAIAIe0BAgDsAgAh8wEQAOgCACH0AQEAtAIAIYkCAADvAgAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACABAAAADQAgCQgAAO4CACAOAADtAgAgygEAAOsCADDLAQAAEwAQzAEAAOsCADDNAQEAtAIAIesBAQC0AgAh7AEBALQCACHtAQIA7AIAIQIIAADhBAAgDgAA3QQAIAkIAADuAgAgDgAA7QIAIMoBAADrAgAwywEAABMAEMwBAADrAgAwzQEBAAAAAesBAQC0AgAh7AEBALQCACHtAQIA7AIAIQMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAQAAABMAIAEAAAAJACABAAAADQAgAQAAABMAIAwKAADFAgAgCwAA6gIAIMoBAADnAgAwywEAABwAEMwBAADnAgAwzQEBALQCACHRAUAAtQIAIdIBQAC1AgAh9QEQAOgCACH2AQEAtAIAIfgBAADpAvgBIvkBAQC0AgAhAgoAAKUDACALAADgBAAgDAoAAMUCACALAADqAgAgygEAAOcCADDLAQAAHAAQzAEAAOcCADDNAQEAAAAB0QFAALUCACHSAUAAtQIAIfUBEADoAgAh9gEBALQCACH4AQAA6QL4ASL5AQEAtAIAIQMAAAAcACABAAAdADACAAAeACADAAAACQAgAQAACgAwAgAACwAgCQcAAMUCACANAADGAgAgygEAAMQCADDLAQAAIQAQzAEAAMQCADDNAQEAtAIAIdEBQAC1AgAh0gFAALUCACHgAQEAtAIAIQEAAAAhACAMBwAAxQIAIMoBAADmAgAwywEAACMAEMwBAADmAgAwzQEBALQCACHQAUAAtQIAIdEBQAC1AgAh0gFAALUCACHgAQEAtAIAIegBAQC0AgAh6QEBANwCACHqAQEA3AIAIQMHAAClAwAg6QEAAPsCACDqAQAA-wIAIAwHAADFAgAgygEAAOYCADDLAQAAIwAQzAEAAOYCADDNAQEAAAAB0AFAALUCACHRAUAAtQIAIdIBQAC1AgAh4AEBALQCACHoAQEAAAAB6QEBANwCACHqAQEA3AIAIQMAAAAjACABAAAkADACAAAlACARBwAAxQIAIMoBAADkAgAwywEAACcAEMwBAADkAgAwzQEBALQCACHRAUAAtQIAIdIBQAC1AgAh3gEBALQCACHfAQEAtAIAIeABAQC0AgAh4QEBANwCACHiAQEA3AIAIeMBAQDcAgAh5AFAAOUCACHlAUAA5QIAIeYBAQDcAgAh5wEBANwCACEIBwAApQMAIOEBAAD7AgAg4gEAAPsCACDjAQAA-wIAIOQBAAD7AgAg5QEAAPsCACDmAQAA-wIAIOcBAAD7AgAgEQcAAMUCACDKAQAA5AIAMMsBAAAnABDMAQAA5AIAMM0BAQAAAAHRAUAAtQIAIdIBQAC1AgAh3gEBALQCACHfAQEAtAIAIeABAQC0AgAh4QEBANwCACHiAQEA3AIAIeMBAQDcAgAh5AFAAOUCACHlAUAA5QIAIeYBAQDcAgAh5wEBANwCACEDAAAAJwAgAQAAKAAwAgAAKQAgAQAAAAMAIAEAAAAcACABAAAACQAgAQAAACMAIAEAAAAnACABAAAAAQAgFQMAANMCACAJAADgAgAgDgAA4QIAIA8AAN8CACAQAADiAgAgEQAA4wIAIMoBAADbAgAwywEAADEAEMwBAADbAgAwzQEBALQCACHRAUAAtQIAIdIBQAC1AgAh5wEBANwCACH6AQEAtAIAIYECAQC0AgAhgwIAAN0CgwIihAIgAN4CACGFAgEA3AIAIYYCAQDcAgAhhwIgAN4CACGIAgEA3AIAIQoDAACOBAAgCQAA3AQAIA4AAN0EACAPAADbBAAgEAAA3gQAIBEAAN8EACDnAQAA-wIAIIUCAAD7AgAghgIAAPsCACCIAgAA-wIAIAMAAAAxACABAAAyADACAAABACADAAAAMQAgAQAAMgAwAgAAAQAgAwAAADEAIAEAADIAMAIAAAEAIBIDAADVBAAgCQAA1wQAIA4AANgEACAPAADWBAAgEAAA2QQAIBEAANoEACDNAQEAAAAB0QFAAAAAAdIBQAAAAAHnAQEAAAAB-gEBAAAAAYECAQAAAAGDAgAAAIMCAoQCIAAAAAGFAgEAAAABhgIBAAAAAYcCIAAAAAGIAgEAAAABARcAADYAIAzNAQEAAAAB0QFAAAAAAdIBQAAAAAHnAQEAAAAB-gEBAAAAAYECAQAAAAGDAgAAAIMCAoQCIAAAAAGFAgEAAAABhgIBAAAAAYcCIAAAAAGIAgEAAAABARcAADgAMAEXAAA4ADASAwAAlAQAIAkAAJYEACAOAACXBAAgDwAAlQQAIBAAAJgEACARAACZBAAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh5wEBAP8CACH6AQEA-QIAIYECAQD5AgAhgwIAAJIEgwIihAIgAJMEACGFAgEA_wIAIYYCAQD_AgAhhwIgAJMEACGIAgEA_wIAIQIAAAABACAXAAA7ACAMzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh5wEBAP8CACH6AQEA-QIAIYECAQD5AgAhgwIAAJIEgwIihAIgAJMEACGFAgEA_wIAIYYCAQD_AgAhhwIgAJMEACGIAgEA_wIAIQIAAAAxACAXAAA9ACACAAAAMQAgFwAAPQAgAwAAAAEAIB4AADYAIB8AADsAIAEAAAABACABAAAAMQAgBwQAAI8EACAkAACRBAAgJQAAkAQAIOcBAAD7AgAghQIAAPsCACCGAgAA-wIAIIgCAAD7AgAgD8oBAADUAgAwywEAAEQAEMwBAADUAgAwzQEBAKwCACHRAUAArQIAIdIBQACtAgAh5wEBALcCACH6AQEArAIAIYECAQCsAgAhgwIAANUCgwIihAIgANYCACGFAgEAtwIAIYYCAQC3AgAhhwIgANYCACGIAgEAtwIAIQMAAAAxACABAABDADAjAABEACADAAAAMQAgAQAAMgAwAgAAAQAgCAMAANMCACDKAQAA0gIAMMsBAABKABDMAQAA0gIAMM0BAQAAAAHRAUAAtQIAIdIBQAC1AgAh-gEBAAAAAQEAAABHACABAAAARwAgCAMAANMCACDKAQAA0gIAMMsBAABKABDMAQAA0gIAMM0BAQC0AgAh0QFAALUCACHSAUAAtQIAIfoBAQC0AgAhAQMAAI4EACADAAAASgAgAQAASwAwAgAARwAgAwAAAEoAIAEAAEsAMAIAAEcAIAMAAABKACABAABLADACAABHACAFAwAAjQQAIM0BAQAAAAHRAUAAAAAB0gFAAAAAAfoBAQAAAAEBFwAATwAgBM0BAQAAAAHRAUAAAAAB0gFAAAAAAfoBAQAAAAEBFwAAUQAwARcAAFEAMAUDAACABAAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh-gEBAPkCACECAAAARwAgFwAAVAAgBM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAIfoBAQD5AgAhAgAAAEoAIBcAAFYAIAIAAABKACAXAABWACADAAAARwAgHgAATwAgHwAAVAAgAQAAAEcAIAEAAABKACADBAAA_QMAICQAAP8DACAlAAD-AwAgB8oBAADRAgAwywEAAF0AEMwBAADRAgAwzQEBAKwCACHRAUAArQIAIdIBQACtAgAh-gEBAKwCACEDAAAASgAgAQAAXAAwIwAAXQAgAwAAAEoAIAEAAEsAMAIAAEcAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgEAUAAPgDACAGAAD5AwAgCQAA-gMAIAsAAPsDACANAAD8AwAgzQEBAAAAAdEBQAAAAAHSAUAAAAAB8wEQAAAAAfoBAQAAAAH7AQEAAAAB_AECAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAYACAQAAAAEBFwAAZQAgC80BAQAAAAHRAUAAAAAB0gFAAAAAAfMBEAAAAAH6AQEAAAAB-wEBAAAAAfwBAgAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABARcAAGcAMAEXAABnADAQBQAA1QMAIAYAANYDACAJAADXAwAgCwAA2AMAIA0AANkDACDNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHzARAAtQMAIfoBAQD5AgAh-wEBAPkCACH8AQIAjQMAIf0BAQD5AgAh_gEBAP8CACH_AQEA-QIAIYACAQD5AgAhAgAAAAUAIBcAAGoAIAvNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHzARAAtQMAIfoBAQD5AgAh-wEBAPkCACH8AQIAjQMAIf0BAQD5AgAh_gEBAP8CACH_AQEA-QIAIYACAQD5AgAhAgAAAAMAIBcAAGwAIAIAAAADACAXAABsACADAAAABQAgHgAAZQAgHwAAagAgAQAAAAUAIAEAAAADACAGBAAA0AMAICQAANMDACAlAADSAwAgRgAA0QMAIEcAANQDACD-AQAA-wIAIA7KAQAA0AIAMMsBAABzABDMAQAA0AIAMM0BAQCsAgAh0QFAAK0CACHSAUAArQIAIfMBEADJAgAh-gEBAKwCACH7AQEArAIAIfwBAgDAAgAh_QEBAKwCACH-AQEAtwIAIf8BAQCsAgAhgAIBAKwCACEDAAAAAwAgAQAAcgAwIwAAcwAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAeACABAAAAHgAgAwAAABwAIAEAAB0AMAIAAB4AIAMAAAAcACABAAAdADACAAAeACADAAAAHAAgAQAAHQAwAgAAHgAgCQoAAM4DACALAADPAwAgzQEBAAAAAdEBQAAAAAHSAUAAAAAB9QEQAAAAAfYBAQAAAAH4AQAAAPgBAvkBAQAAAAEBFwAAewAgB80BAQAAAAHRAUAAAAAB0gFAAAAAAfUBEAAAAAH2AQEAAAAB-AEAAAD4AQL5AQEAAAABARcAAH0AMAEXAAB9ADAJCgAAwAMAIAsAAMEDACDNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACH1ARAAtQMAIfYBAQD5AgAh-AEAAL8D-AEi-QEBAPkCACECAAAAHgAgFwAAgAEAIAfNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACH1ARAAtQMAIfYBAQD5AgAh-AEAAL8D-AEi-QEBAPkCACECAAAAHAAgFwAAggEAIAIAAAAcACAXAACCAQAgAwAAAB4AIB4AAHsAIB8AAIABACABAAAAHgAgAQAAABwAIAUEAAC6AwAgJAAAvQMAICUAALwDACBGAAC7AwAgRwAAvgMAIArKAQAAzAIAMMsBAACJAQAQzAEAAMwCADDNAQEArAIAIdEBQACtAgAh0gFAAK0CACH1ARAAyQIAIfYBAQCsAgAh-AEAAM0C-AEi-QEBAKwCACEDAAAAHAAgAQAAiAEAMCMAAIkBACADAAAAHAAgAQAAHQAwAgAAHgAgAQAAAA8AIAEAAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACAJCAAAuQMAIAwAALgDACDNAQEAAAAB0QFAAAAAAdIBQAAAAAHsAQEAAAAB7QECAAAAAfMBEAAAAAH0AQEAAAABARcAAJEBACAHzQEBAAAAAdEBQAAAAAHSAUAAAAAB7AEBAAAAAe0BAgAAAAHzARAAAAAB9AEBAAAAAQEXAACTAQAwARcAAJMBADAJCAAAtwMAIAwAALYDACDNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHsAQEA-QIAIe0BAgCNAwAh8wEQALUDACH0AQEA-QIAIQIAAAAPACAXAACWAQAgB80BAQD5AgAh0QFAAPoCACHSAUAA-gIAIewBAQD5AgAh7QECAI0DACHzARAAtQMAIfQBAQD5AgAhAgAAAA0AIBcAAJgBACACAAAADQAgFwAAmAEAIAMAAAAPACAeAACRAQAgHwAAlgEAIAEAAAAPACABAAAADQAgBQQAALADACAkAACzAwAgJQAAsgMAIEYAALEDACBHAAC0AwAgCsoBAADIAgAwywEAAJ8BABDMAQAAyAIAMM0BAQCsAgAh0QFAAK0CACHSAUAArQIAIewBAQCsAgAh7QECAMACACHzARAAyQIAIfQBAQCsAgAhAwAAAA0AIAEAAJ4BADAjAACfAQAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAALACABAAAACwAgAwAAAAkAIAEAAAoAMAIAAAsAIAMAAAAJACABAAAKADACAAALACADAAAACQAgAQAACgAwAgAACwAgCQcAAK4DACAIAACvAwAgzQEBAAAAAdEBQAAAAAHSAUAAAAAB4AEBAAAAAewBAQAAAAHxAQIAAAAB8gEBAAAAAQEXAACnAQAgB80BAQAAAAHRAUAAAAAB0gFAAAAAAeABAQAAAAHsAQEAAAAB8QECAAAAAfIBAQAAAAEBFwAAqQEAMAEXAACpAQAwCQcAAKwDACAIAACtAwAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh4AEBAPkCACHsAQEA-QIAIfEBAgCNAwAh8gEBAP8CACECAAAACwAgFwAArAEAIAfNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHgAQEA-QIAIewBAQD5AgAh8QECAI0DACHyAQEA_wIAIQIAAAAJACAXAACuAQAgAgAAAAkAIBcAAK4BACADAAAACwAgHgAApwEAIB8AAKwBACABAAAACwAgAQAAAAkAIAYEAACnAwAgJAAAqgMAICUAAKkDACBGAACoAwAgRwAAqwMAIPIBAAD7AgAgCsoBAADHAgAwywEAALUBABDMAQAAxwIAMM0BAQCsAgAh0QFAAK0CACHSAUAArQIAIeABAQCsAgAh7AEBAKwCACHxAQIAwAIAIfIBAQC3AgAhAwAAAAkAIAEAALQBADAjAAC1AQAgAwAAAAkAIAEAAAoAMAIAAAsAIAkHAADFAgAgDQAAxgIAIMoBAADEAgAwywEAACEAEMwBAADEAgAwzQEBAAAAAdEBQAC1AgAh0gFAALUCACHgAQEAAAABAQAAALgBACABAAAAuAEAIAIHAAClAwAgDQAApgMAIAMAAAAhACABAAC7AQAwAgAAuAEAIAMAAAAhACABAAC7AQAwAgAAuAEAIAMAAAAhACABAAC7AQAwAgAAuAEAIAYHAACjAwAgDQAApAMAIM0BAQAAAAHRAUAAAAAB0gFAAAAAAeABAQAAAAEBFwAAvwEAIATNAQEAAAAB0QFAAAAAAdIBQAAAAAHgAQEAAAABARcAAMEBADABFwAAwQEAMAYHAACVAwAgDQAAlgMAIM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAIeABAQD5AgAhAgAAALgBACAXAADEAQAgBM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAIeABAQD5AgAhAgAAACEAIBcAAMYBACACAAAAIQAgFwAAxgEAIAMAAAC4AQAgHgAAvwEAIB8AAMQBACABAAAAuAEAIAEAAAAhACADBAAAkgMAICQAAJQDACAlAACTAwAgB8oBAADDAgAwywEAAM0BABDMAQAAwwIAMM0BAQCsAgAh0QFAAK0CACHSAUAArQIAIeABAQCsAgAhAwAAACEAIAEAAMwBADAjAADNAQAgAwAAACEAIAEAALsBADACAAC4AQAgAQAAABUAIAEAAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAATACABAAAUADACAAAVACAGCAAAkQMAIA4AAJADACDNAQEAAAAB6wEBAAAAAewBAQAAAAHtAQIAAAABARcAANUBACAEzQEBAAAAAesBAQAAAAHsAQEAAAAB7QECAAAAAQEXAADXAQAwARcAANcBADAGCAAAjwMAIA4AAI4DACDNAQEA-QIAIesBAQD5AgAh7AEBAPkCACHtAQIAjQMAIQIAAAAVACAXAADaAQAgBM0BAQD5AgAh6wEBAPkCACHsAQEA-QIAIe0BAgCNAwAhAgAAABMAIBcAANwBACACAAAAEwAgFwAA3AEAIAMAAAAVACAeAADVAQAgHwAA2gEAIAEAAAAVACABAAAAEwAgBQQAAIgDACAkAACLAwAgJQAAigMAIEYAAIkDACBHAACMAwAgB8oBAAC_AgAwywEAAOMBABDMAQAAvwIAMM0BAQCsAgAh6wEBAKwCACHsAQEArAIAIe0BAgDAAgAhAwAAABMAIAEAAOIBADAjAADjAQAgAwAAABMAIAEAABQAMAIAABUAIAEAAAAlACABAAAAJQAgAwAAACMAIAEAACQAMAIAACUAIAMAAAAjACABAAAkADACAAAlACADAAAAIwAgAQAAJAAwAgAAJQAgCQcAAIcDACDNAQEAAAAB0AFAAAAAAdEBQAAAAAHSAUAAAAAB4AEBAAAAAegBAQAAAAHpAQEAAAAB6gEBAAAAAQEXAADrAQAgCM0BAQAAAAHQAUAAAAAB0QFAAAAAAdIBQAAAAAHgAQEAAAAB6AEBAAAAAekBAQAAAAHqAQEAAAABARcAAO0BADABFwAA7QEAMAkHAACGAwAgzQEBAPkCACHQAUAA-gIAIdEBQAD6AgAh0gFAAPoCACHgAQEA-QIAIegBAQD5AgAh6QEBAP8CACHqAQEA_wIAIQIAAAAlACAXAADwAQAgCM0BAQD5AgAh0AFAAPoCACHRAUAA-gIAIdIBQAD6AgAh4AEBAPkCACHoAQEA-QIAIekBAQD_AgAh6gEBAP8CACECAAAAIwAgFwAA8gEAIAIAAAAjACAXAADyAQAgAwAAACUAIB4AAOsBACAfAADwAQAgAQAAACUAIAEAAAAjACAFBAAAgwMAICQAAIUDACAlAACEAwAg6QEAAPsCACDqAQAA-wIAIAvKAQAAvgIAMMsBAAD5AQAQzAEAAL4CADDNAQEArAIAIdABQACtAgAh0QFAAK0CACHSAUAArQIAIeABAQCsAgAh6AEBAKwCACHpAQEAtwIAIeoBAQC3AgAhAwAAACMAIAEAAPgBADAjAAD5AQAgAwAAACMAIAEAACQAMAIAACUAIAEAAAApACABAAAAKQAgAwAAACcAIAEAACgAMAIAACkAIAMAAAAnACABAAAoADACAAApACADAAAAJwAgAQAAKAAwAgAAKQAgDgcAAIIDACDNAQEAAAAB0QFAAAAAAdIBQAAAAAHeAQEAAAAB3wEBAAAAAeABAQAAAAHhAQEAAAAB4gEBAAAAAeMBAQAAAAHkAUAAAAAB5QFAAAAAAeYBAQAAAAHnAQEAAAABARcAAIECACANzQEBAAAAAdEBQAAAAAHSAUAAAAAB3gEBAAAAAd8BAQAAAAHgAQEAAAAB4QEBAAAAAeIBAQAAAAHjAQEAAAAB5AFAAAAAAeUBQAAAAAHmAQEAAAAB5wEBAAAAAQEXAACDAgAwARcAAIMCADAOBwAAgQMAIM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAId4BAQD5AgAh3wEBAPkCACHgAQEA-QIAIeEBAQD_AgAh4gEBAP8CACHjAQEA_wIAIeQBQACAAwAh5QFAAIADACHmAQEA_wIAIecBAQD_AgAhAgAAACkAIBcAAIYCACANzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh3gEBAPkCACHfAQEA-QIAIeABAQD5AgAh4QEBAP8CACHiAQEA_wIAIeMBAQD_AgAh5AFAAIADACHlAUAAgAMAIeYBAQD_AgAh5wEBAP8CACECAAAAJwAgFwAAiAIAIAIAAAAnACAXAACIAgAgAwAAACkAIB4AAIECACAfAACGAgAgAQAAACkAIAEAAAAnACAKBAAA_AIAICQAAP4CACAlAAD9AgAg4QEAAPsCACDiAQAA-wIAIOMBAAD7AgAg5AEAAPsCACDlAQAA-wIAIOYBAAD7AgAg5wEAAPsCACAQygEAALYCADDLAQAAjwIAEMwBAAC2AgAwzQEBAKwCACHRAUAArQIAIdIBQACtAgAh3gEBAKwCACHfAQEArAIAIeABAQCsAgAh4QEBALcCACHiAQEAtwIAIeMBAQC3AgAh5AFAALgCACHlAUAAuAIAIeYBAQC3AgAh5wEBALcCACEDAAAAJwAgAQAAjgIAMCMAAI8CACADAAAAJwAgAQAAKAAwAgAAKQAgCcoBAACzAgAwywEAAJUCABDMAQAAswIAMM0BAQAAAAHOAQEAtAIAIc8BAQC0AgAh0AFAALUCACHRAUAAtQIAIdIBQAC1AgAhAQAAAJICACABAAAAkgIAIAnKAQAAswIAMMsBAACVAgAQzAEAALMCADDNAQEAtAIAIc4BAQC0AgAhzwEBALQCACHQAUAAtQIAIdEBQAC1AgAh0gFAALUCACEAAwAAAJUCACABAACWAgAwAgAAkgIAIAMAAACVAgAgAQAAlgIAMAIAAJICACADAAAAlQIAIAEAAJYCADACAACSAgAgBs0BAQAAAAHOAQEAAAABzwEBAAAAAdABQAAAAAHRAUAAAAAB0gFAAAAAAQEXAACaAgAgBs0BAQAAAAHOAQEAAAABzwEBAAAAAdABQAAAAAHRAUAAAAAB0gFAAAAAAQEXAACcAgAwARcAAJwCADAGzQEBAPkCACHOAQEA-QIAIc8BAQD5AgAh0AFAAPoCACHRAUAA-gIAIdIBQAD6AgAhAgAAAJICACAXAACfAgAgBs0BAQD5AgAhzgEBAPkCACHPAQEA-QIAIdABQAD6AgAh0QFAAPoCACHSAUAA-gIAIQIAAACVAgAgFwAAoQIAIAIAAACVAgAgFwAAoQIAIAMAAACSAgAgHgAAmgIAIB8AAJ8CACABAAAAkgIAIAEAAACVAgAgAwQAAPYCACAkAAD4AgAgJQAA9wIAIAnKAQAAqwIAMMsBAACoAgAQzAEAAKsCADDNAQEArAIAIc4BAQCsAgAhzwEBAKwCACHQAUAArQIAIdEBQACtAgAh0gFAAK0CACEDAAAAlQIAIAEAAKcCADAjAACoAgAgAwAAAJUCACABAACWAgAwAgAAkgIAIAnKAQAAqwIAMMsBAACoAgAQzAEAAKsCADDNAQEArAIAIc4BAQCsAgAhzwEBAKwCACHQAUAArQIAIdEBQACtAgAh0gFAAK0CACEOBAAArwIAICQAALICACAlAACyAgAg0wEBAAAAAdQBAQAAAATVAQEAAAAE1gEBAAAAAdcBAQAAAAHYAQEAAAAB2QEBAAAAAdoBAQCxAgAh2wEBAAAAAdwBAQAAAAHdAQEAAAABCwQAAK8CACAkAACwAgAgJQAAsAIAINMBQAAAAAHUAUAAAAAE1QFAAAAABNYBQAAAAAHXAUAAAAAB2AFAAAAAAdkBQAAAAAHaAUAArgIAIQsEAACvAgAgJAAAsAIAICUAALACACDTAUAAAAAB1AFAAAAABNUBQAAAAATWAUAAAAAB1wFAAAAAAdgBQAAAAAHZAUAAAAAB2gFAAK4CACEI0wECAAAAAdQBAgAAAATVAQIAAAAE1gECAAAAAdcBAgAAAAHYAQIAAAAB2QECAAAAAdoBAgCvAgAhCNMBQAAAAAHUAUAAAAAE1QFAAAAABNYBQAAAAAHXAUAAAAAB2AFAAAAAAdkBQAAAAAHaAUAAsAIAIQ4EAACvAgAgJAAAsgIAICUAALICACDTAQEAAAAB1AEBAAAABNUBAQAAAATWAQEAAAAB1wEBAAAAAdgBAQAAAAHZAQEAAAAB2gEBALECACHbAQEAAAAB3AEBAAAAAd0BAQAAAAEL0wEBAAAAAdQBAQAAAATVAQEAAAAE1gEBAAAAAdcBAQAAAAHYAQEAAAAB2QEBAAAAAdoBAQCyAgAh2wEBAAAAAdwBAQAAAAHdAQEAAAABCcoBAACzAgAwywEAAJUCABDMAQAAswIAMM0BAQC0AgAhzgEBALQCACHPAQEAtAIAIdABQAC1AgAh0QFAALUCACHSAUAAtQIAIQvTAQEAAAAB1AEBAAAABNUBAQAAAATWAQEAAAAB1wEBAAAAAdgBAQAAAAHZAQEAAAAB2gEBALICACHbAQEAAAAB3AEBAAAAAd0BAQAAAAEI0wFAAAAAAdQBQAAAAATVAUAAAAAE1gFAAAAAAdcBQAAAAAHYAUAAAAAB2QFAAAAAAdoBQACwAgAhEMoBAAC2AgAwywEAAI8CABDMAQAAtgIAMM0BAQCsAgAh0QFAAK0CACHSAUAArQIAId4BAQCsAgAh3wEBAKwCACHgAQEArAIAIeEBAQC3AgAh4gEBALcCACHjAQEAtwIAIeQBQAC4AgAh5QFAALgCACHmAQEAtwIAIecBAQC3AgAhDgQAALoCACAkAAC9AgAgJQAAvQIAINMBAQAAAAHUAQEAAAAF1QEBAAAABdYBAQAAAAHXAQEAAAAB2AEBAAAAAdkBAQAAAAHaAQEAvAIAIdsBAQAAAAHcAQEAAAAB3QEBAAAAAQsEAAC6AgAgJAAAuwIAICUAALsCACDTAUAAAAAB1AFAAAAABdUBQAAAAAXWAUAAAAAB1wFAAAAAAdgBQAAAAAHZAUAAAAAB2gFAALkCACELBAAAugIAICQAALsCACAlAAC7AgAg0wFAAAAAAdQBQAAAAAXVAUAAAAAF1gFAAAAAAdcBQAAAAAHYAUAAAAAB2QFAAAAAAdoBQAC5AgAhCNMBAgAAAAHUAQIAAAAF1QECAAAABdYBAgAAAAHXAQIAAAAB2AECAAAAAdkBAgAAAAHaAQIAugIAIQjTAUAAAAAB1AFAAAAABdUBQAAAAAXWAUAAAAAB1wFAAAAAAdgBQAAAAAHZAUAAAAAB2gFAALsCACEOBAAAugIAICQAAL0CACAlAAC9AgAg0wEBAAAAAdQBAQAAAAXVAQEAAAAF1gEBAAAAAdcBAQAAAAHYAQEAAAAB2QEBAAAAAdoBAQC8AgAh2wEBAAAAAdwBAQAAAAHdAQEAAAABC9MBAQAAAAHUAQEAAAAF1QEBAAAABdYBAQAAAAHXAQEAAAAB2AEBAAAAAdkBAQAAAAHaAQEAvQIAIdsBAQAAAAHcAQEAAAAB3QEBAAAAAQvKAQAAvgIAMMsBAAD5AQAQzAEAAL4CADDNAQEArAIAIdABQACtAgAh0QFAAK0CACHSAUAArQIAIeABAQCsAgAh6AEBAKwCACHpAQEAtwIAIeoBAQC3AgAhB8oBAAC_AgAwywEAAOMBABDMAQAAvwIAMM0BAQCsAgAh6wEBAKwCACHsAQEArAIAIe0BAgDAAgAhDQQAAK8CACAkAACvAgAgJQAArwIAIEYAAMICACBHAACvAgAg0wECAAAAAdQBAgAAAATVAQIAAAAE1gECAAAAAdcBAgAAAAHYAQIAAAAB2QECAAAAAdoBAgDBAgAhDQQAAK8CACAkAACvAgAgJQAArwIAIEYAAMICACBHAACvAgAg0wECAAAAAdQBAgAAAATVAQIAAAAE1gECAAAAAdcBAgAAAAHYAQIAAAAB2QECAAAAAdoBAgDBAgAhCNMBCAAAAAHUAQgAAAAE1QEIAAAABNYBCAAAAAHXAQgAAAAB2AEIAAAAAdkBCAAAAAHaAQgAwgIAIQfKAQAAwwIAMMsBAADNAQAQzAEAAMMCADDNAQEArAIAIdEBQACtAgAh0gFAAK0CACHgAQEArAIAIQkHAADFAgAgDQAAxgIAIMoBAADEAgAwywEAACEAEMwBAADEAgAwzQEBALQCACHRAUAAtQIAIdIBQAC1AgAh4AEBALQCACEXAwAA0wIAIAkAAOACACAOAADhAgAgDwAA3wIAIBAAAOICACARAADjAgAgygEAANsCADDLAQAAMQAQzAEAANsCADDNAQEAtAIAIdEBQAC1AgAh0gFAALUCACHnAQEA3AIAIfoBAQC0AgAhgQIBALQCACGDAgAA3QKDAiKEAiAA3gIAIYUCAQDcAgAhhgIBANwCACGHAiAA3gIAIYgCAQDcAgAhiwIAADEAIIwCAAAxACAD7gEAABMAIO8BAAATACDwAQAAEwAgCsoBAADHAgAwywEAALUBABDMAQAAxwIAMM0BAQCsAgAh0QFAAK0CACHSAUAArQIAIeABAQCsAgAh7AEBAKwCACHxAQIAwAIAIfIBAQC3AgAhCsoBAADIAgAwywEAAJ8BABDMAQAAyAIAMM0BAQCsAgAh0QFAAK0CACHSAUAArQIAIewBAQCsAgAh7QECAMACACHzARAAyQIAIfQBAQCsAgAhDQQAAK8CACAkAADLAgAgJQAAywIAIEYAAMsCACBHAADLAgAg0wEQAAAAAdQBEAAAAATVARAAAAAE1gEQAAAAAdcBEAAAAAHYARAAAAAB2QEQAAAAAdoBEADKAgAhDQQAAK8CACAkAADLAgAgJQAAywIAIEYAAMsCACBHAADLAgAg0wEQAAAAAdQBEAAAAATVARAAAAAE1gEQAAAAAdcBEAAAAAHYARAAAAAB2QEQAAAAAdoBEADKAgAhCNMBEAAAAAHUARAAAAAE1QEQAAAABNYBEAAAAAHXARAAAAAB2AEQAAAAAdkBEAAAAAHaARAAywIAIQrKAQAAzAIAMMsBAACJAQAQzAEAAMwCADDNAQEArAIAIdEBQACtAgAh0gFAAK0CACH1ARAAyQIAIfYBAQCsAgAh-AEAAM0C-AEi-QEBAKwCACEHBAAArwIAICQAAM8CACAlAADPAgAg0wEAAAD4AQLUAQAAAPgBCNUBAAAA-AEI2gEAAM4C-AEiBwQAAK8CACAkAADPAgAgJQAAzwIAINMBAAAA-AEC1AEAAAD4AQjVAQAAAPgBCNoBAADOAvgBIgTTAQAAAPgBAtQBAAAA-AEI1QEAAAD4AQjaAQAAzwL4ASIOygEAANACADDLAQAAcwAQzAEAANACADDNAQEArAIAIdEBQACtAgAh0gFAAK0CACHzARAAyQIAIfoBAQCsAgAh-wEBAKwCACH8AQIAwAIAIf0BAQCsAgAh_gEBALcCACH_AQEArAIAIYACAQCsAgAhB8oBAADRAgAwywEAAF0AEMwBAADRAgAwzQEBAKwCACHRAUAArQIAIdIBQACtAgAh-gEBAKwCACEIAwAA0wIAIMoBAADSAgAwywEAAEoAEMwBAADSAgAwzQEBALQCACHRAUAAtQIAIdIBQAC1AgAh-gEBALQCACED7gEAAAMAIO8BAAADACDwAQAAAwAgD8oBAADUAgAwywEAAEQAEMwBAADUAgAwzQEBAKwCACHRAUAArQIAIdIBQACtAgAh5wEBALcCACH6AQEArAIAIYECAQCsAgAhgwIAANUCgwIihAIgANYCACGFAgEAtwIAIYYCAQC3AgAhhwIgANYCACGIAgEAtwIAIQcEAACvAgAgJAAA2gIAICUAANoCACDTAQAAAIMCAtQBAAAAgwII1QEAAACDAgjaAQAA2QKDAiIFBAAArwIAICQAANgCACAlAADYAgAg0wEgAAAAAdoBIADXAgAhBQQAAK8CACAkAADYAgAgJQAA2AIAINMBIAAAAAHaASAA1wIAIQLTASAAAAAB2gEgANgCACEHBAAArwIAICQAANoCACAlAADaAgAg0wEAAACDAgLUAQAAAIMCCNUBAAAAgwII2gEAANkCgwIiBNMBAAAAgwIC1AEAAACDAgjVAQAAAIMCCNoBAADaAoMCIhUDAADTAgAgCQAA4AIAIA4AAOECACAPAADfAgAgEAAA4gIAIBEAAOMCACDKAQAA2wIAMMsBAAAxABDMAQAA2wIAMM0BAQC0AgAh0QFAALUCACHSAUAAtQIAIecBAQDcAgAh-gEBALQCACGBAgEAtAIAIYMCAADdAoMCIoQCIADeAgAhhQIBANwCACGGAgEA3AIAIYcCIADeAgAhiAIBANwCACEL0wEBAAAAAdQBAQAAAAXVAQEAAAAF1gEBAAAAAdcBAQAAAAHYAQEAAAAB2QEBAAAAAdoBAQC9AgAh2wEBAAAAAdwBAQAAAAHdAQEAAAABBNMBAAAAgwIC1AEAAACDAgjVAQAAAIMCCNoBAADaAoMCIgLTASAAAAAB2gEgANgCACED7gEAABwAIO8BAAAcACDwAQAAHAAgA-4BAAAJACDvAQAACQAg8AEAAAkAIAsHAADFAgAgDQAAxgIAIMoBAADEAgAwywEAACEAEMwBAADEAgAwzQEBALQCACHRAUAAtQIAIdIBQAC1AgAh4AEBALQCACGLAgAAIQAgjAIAACEAIAPuAQAAIwAg7wEAACMAIPABAAAjACAD7gEAACcAIO8BAAAnACDwAQAAJwAgEQcAAMUCACDKAQAA5AIAMMsBAAAnABDMAQAA5AIAMM0BAQC0AgAh0QFAALUCACHSAUAAtQIAId4BAQC0AgAh3wEBALQCACHgAQEAtAIAIeEBAQDcAgAh4gEBANwCACHjAQEA3AIAIeQBQADlAgAh5QFAAOUCACHmAQEA3AIAIecBAQDcAgAhCNMBQAAAAAHUAUAAAAAF1QFAAAAABdYBQAAAAAHXAUAAAAAB2AFAAAAAAdkBQAAAAAHaAUAAuwIAIQwHAADFAgAgygEAAOYCADDLAQAAIwAQzAEAAOYCADDNAQEAtAIAIdABQAC1AgAh0QFAALUCACHSAUAAtQIAIeABAQC0AgAh6AEBALQCACHpAQEA3AIAIeoBAQDcAgAhDAoAAMUCACALAADqAgAgygEAAOcCADDLAQAAHAAQzAEAAOcCADDNAQEAtAIAIdEBQAC1AgAh0gFAALUCACH1ARAA6AIAIfYBAQC0AgAh-AEAAOkC-AEi-QEBALQCACEI0wEQAAAAAdQBEAAAAATVARAAAAAE1gEQAAAAAdcBEAAAAAHYARAAAAAB2QEQAAAAAdoBEADLAgAhBNMBAAAA-AEC1AEAAAD4AQjVAQAAAPgBCNoBAADPAvgBIgPuAQAADQAg7wEAAA0AIPABAAANACAJCAAA7gIAIA4AAO0CACDKAQAA6wIAMMsBAAATABDMAQAA6wIAMM0BAQC0AgAh6wEBALQCACHsAQEAtAIAIe0BAgDsAgAhCNMBAgAAAAHUAQIAAAAE1QECAAAABNYBAgAAAAHXAQIAAAAB2AECAAAAAdkBAgAAAAHaAQIArwIAIQsHAADFAgAgDQAAxgIAIMoBAADEAgAwywEAACEAEMwBAADEAgAwzQEBALQCACHRAUAAtQIAIdIBQAC1AgAh4AEBALQCACGLAgAAIQAgjAIAACEAIBUFAAD1AgAgBgAAxQIAIAkAAOACACALAADqAgAgDQAAxgIAIMoBAAD0AgAwywEAAAMAEMwBAAD0AgAwzQEBALQCACHRAUAAtQIAIdIBQAC1AgAh8wEQAOgCACH6AQEAtAIAIfsBAQC0AgAh_AECAOwCACH9AQEAtAIAIf4BAQDcAgAh_wEBALQCACGAAgEAtAIAIYsCAAADACCMAgAAAwAgAuwBAQAAAAH0AQEAAAABDAgAAO4CACAMAADxAgAgygEAAPACADDLAQAADQAQzAEAAPACADDNAQEAtAIAIdEBQAC1AgAh0gFAALUCACHsAQEAtAIAIe0BAgDsAgAh8wEQAOgCACH0AQEAtAIAIQ4KAADFAgAgCwAA6gIAIMoBAADnAgAwywEAABwAEMwBAADnAgAwzQEBALQCACHRAUAAtQIAIdIBQAC1AgAh9QEQAOgCACH2AQEAtAIAIfgBAADpAvgBIvkBAQC0AgAhiwIAABwAIIwCAAAcACAC4AEBAAAAAewBAQAAAAEMBwAAxQIAIAgAAO4CACDKAQAA8wIAMMsBAAAJABDMAQAA8wIAMM0BAQC0AgAh0QFAALUCACHSAUAAtQIAIeABAQC0AgAh7AEBALQCACHxAQIA7AIAIfIBAQDcAgAhEwUAAPUCACAGAADFAgAgCQAA4AIAIAsAAOoCACANAADGAgAgygEAAPQCADDLAQAAAwAQzAEAAPQCADDNAQEAtAIAIdEBQAC1AgAh0gFAALUCACHzARAA6AIAIfoBAQC0AgAh-wEBALQCACH8AQIA7AIAIf0BAQC0AgAh_gEBANwCACH_AQEAtAIAIYACAQC0AgAhCgMAANMCACDKAQAA0gIAMMsBAABKABDMAQAA0gIAMM0BAQC0AgAh0QFAALUCACHSAUAAtQIAIfoBAQC0AgAhiwIAAEoAIIwCAABKACAAAAABkAIBAAAAAQGQAkAAAAABAAAAAAGQAgEAAAABAZACQAAAAAEFHgAApgUAIB8AAKkFACCNAgAApwUAII4CAACoBQAgkwIAAAEAIAMeAACmBQAgjQIAAKcFACCTAgAAAQAgAAAABR4AAKEFACAfAACkBQAgjQIAAKIFACCOAgAAowUAIJMCAAABACADHgAAoQUAII0CAACiBQAgkwIAAAEAIAAAAAAABZACAgAAAAGWAgIAAAABlwICAAAAAZgCAgAAAAGZAgIAAAABBR4AAJkFACAfAACfBQAgjQIAAJoFACCOAgAAngUAIJMCAAC4AQAgBR4AAJcFACAfAACcBQAgjQIAAJgFACCOAgAAmwUAIJMCAAAFACADHgAAmQUAII0CAACaBQAgkwIAALgBACADHgAAlwUAII0CAACYBQAgkwIAAAUAIAAAAAUeAACRBQAgHwAAlQUAII0CAACSBQAgjgIAAJQFACCTAgAAAQAgCx4AAJcDADAfAACcAwAwjQIAAJgDADCOAgAAmQMAMI8CAACaAwAgkAIAAJsDADCRAgAAmwMAMJICAACbAwAwkwIAAJsDADCUAgAAnQMAMJUCAACeAwAwBAgAAJEDACDNAQEAAAAB7AEBAAAAAe0BAgAAAAECAAAAFQAgHgAAogMAIAMAAAAVACAeAACiAwAgHwAAoQMAIAEXAACTBQAwCQgAAO4CACAOAADtAgAgygEAAOsCADDLAQAAEwAQzAEAAOsCADDNAQEAAAAB6wEBALQCACHsAQEAtAIAIe0BAgDsAgAhAgAAABUAIBcAAKEDACACAAAAnwMAIBcAAKADACAHygEAAJ4DADDLAQAAnwMAEMwBAACeAwAwzQEBALQCACHrAQEAtAIAIewBAQC0AgAh7QECAOwCACEHygEAAJ4DADDLAQAAnwMAEMwBAACeAwAwzQEBALQCACHrAQEAtAIAIewBAQC0AgAh7QECAOwCACEDzQEBAPkCACHsAQEA-QIAIe0BAgCNAwAhBAgAAI8DACDNAQEA-QIAIewBAQD5AgAh7QECAI0DACEECAAAkQMAIM0BAQAAAAHsAQEAAAAB7QECAAAAAQMeAACRBQAgjQIAAJIFACCTAgAAAQAgBB4AAJcDADCNAgAAmAMAMI8CAACaAwAgkwIAAJsDADAKAwAAjgQAIAkAANwEACAOAADdBAAgDwAA2wQAIBAAAN4EACARAADfBAAg5wEAAPsCACCFAgAA-wIAIIYCAAD7AgAgiAIAAPsCACAAAAAAAAAFHgAAiQUAIB8AAI8FACCNAgAAigUAII4CAACOBQAgkwIAAAEAIAUeAACHBQAgHwAAjAUAII0CAACIBQAgjgIAAIsFACCTAgAABQAgAx4AAIkFACCNAgAAigUAIJMCAAABACADHgAAhwUAII0CAACIBQAgkwIAAAUAIAAAAAAABZACEAAAAAGWAhAAAAABlwIQAAAAAZgCEAAAAAGZAhAAAAABBR4AAP8EACAfAACFBQAgjQIAAIAFACCOAgAAhAUAIJMCAAAeACAFHgAA_QQAIB8AAIIFACCNAgAA_gQAII4CAACBBQAgkwIAAAUAIAMeAAD_BAAgjQIAAIAFACCTAgAAHgAgAx4AAP0EACCNAgAA_gQAIJMCAAAFACAAAAAAAAGQAgAAAPgBAgUeAAD3BAAgHwAA-wQAII0CAAD4BAAgjgIAAPoEACCTAgAAAQAgCx4AAMIDADAfAADHAwAwjQIAAMMDADCOAgAAxAMAMI8CAADFAwAgkAIAAMYDADCRAgAAxgMAMJICAADGAwAwkwIAAMYDADCUAgAAyAMAMJUCAADJAwAwBwgAALkDACDNAQEAAAAB0QFAAAAAAdIBQAAAAAHsAQEAAAAB7QECAAAAAfMBEAAAAAECAAAADwAgHgAAzQMAIAMAAAAPACAeAADNAwAgHwAAzAMAIAEXAAD5BAAwDQgAAO4CACAMAADxAgAgygEAAPACADDLAQAADQAQzAEAAPACADDNAQEAAAAB0QFAALUCACHSAUAAtQIAIewBAQC0AgAh7QECAOwCACHzARAA6AIAIfQBAQC0AgAhiQIAAO8CACACAAAADwAgFwAAzAMAIAIAAADKAwAgFwAAywMAIArKAQAAyQMAMMsBAADKAwAQzAEAAMkDADDNAQEAtAIAIdEBQAC1AgAh0gFAALUCACHsAQEAtAIAIe0BAgDsAgAh8wEQAOgCACH0AQEAtAIAIQrKAQAAyQMAMMsBAADKAwAQzAEAAMkDADDNAQEAtAIAIdEBQAC1AgAh0gFAALUCACHsAQEAtAIAIe0BAgDsAgAh8wEQAOgCACH0AQEAtAIAIQbNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHsAQEA-QIAIe0BAgCNAwAh8wEQALUDACEHCAAAtwMAIM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAIewBAQD5AgAh7QECAI0DACHzARAAtQMAIQcIAAC5AwAgzQEBAAAAAdEBQAAAAAHSAUAAAAAB7AEBAAAAAe0BAgAAAAHzARAAAAABAx4AAPcEACCNAgAA-AQAIJMCAAABACAEHgAAwgMAMI0CAADDAwAwjwIAAMUDACCTAgAAxgMAMAAAAAAABR4AAOwEACAfAAD1BAAgjQIAAO0EACCOAgAA9AQAIJMCAABHACAFHgAA6gQAIB8AAPIEACCNAgAA6wQAII4CAADxBAAgkwIAAAEAIAseAADsAwAwHwAA8QMAMI0CAADtAwAwjgIAAO4DADCPAgAA7wMAIJACAADwAwAwkQIAAPADADCSAgAA8AMAMJMCAADwAwAwlAIAAPIDADCVAgAA8wMAMAseAADjAwAwHwAA5wMAMI0CAADkAwAwjgIAAOUDADCPAgAA5gMAIJACAADGAwAwkQIAAMYDADCSAgAAxgMAMJMCAADGAwAwlAIAAOgDADCVAgAAyQMAMAseAADaAwAwHwAA3gMAMI0CAADbAwAwjgIAANwDADCPAgAA3QMAIJACAACbAwAwkQIAAJsDADCSAgAAmwMAMJMCAACbAwAwlAIAAN8DADCVAgAAngMAMAQOAACQAwAgzQEBAAAAAesBAQAAAAHtAQIAAAABAgAAABUAIB4AAOIDACADAAAAFQAgHgAA4gMAIB8AAOEDACABFwAA8AQAMAIAAAAVACAXAADhAwAgAgAAAJ8DACAXAADgAwAgA80BAQD5AgAh6wEBAPkCACHtAQIAjQMAIQQOAACOAwAgzQEBAPkCACHrAQEA-QIAIe0BAgCNAwAhBA4AAJADACDNAQEAAAAB6wEBAAAAAe0BAgAAAAEHDAAAuAMAIM0BAQAAAAHRAUAAAAAB0gFAAAAAAe0BAgAAAAHzARAAAAAB9AEBAAAAAQIAAAAPACAeAADrAwAgAwAAAA8AIB4AAOsDACAfAADqAwAgARcAAO8EADACAAAADwAgFwAA6gMAIAIAAADKAwAgFwAA6QMAIAbNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHtAQIAjQMAIfMBEAC1AwAh9AEBAPkCACEHDAAAtgMAIM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAIe0BAgCNAwAh8wEQALUDACH0AQEA-QIAIQcMAAC4AwAgzQEBAAAAAdEBQAAAAAHSAUAAAAAB7QECAAAAAfMBEAAAAAH0AQEAAAABBwcAAK4DACDNAQEAAAAB0QFAAAAAAdIBQAAAAAHgAQEAAAAB8QECAAAAAfIBAQAAAAECAAAACwAgHgAA9wMAIAMAAAALACAeAAD3AwAgHwAA9gMAIAEXAADuBAAwDQcAAMUCACAIAADuAgAgygEAAPMCADDLAQAACQAQzAEAAPMCADDNAQEAAAAB0QFAALUCACHSAUAAtQIAIeABAQC0AgAh7AEBALQCACHxAQIA7AIAIfIBAQDcAgAhigIAAPICACACAAAACwAgFwAA9gMAIAIAAAD0AwAgFwAA9QMAIArKAQAA8wMAMMsBAAD0AwAQzAEAAPMDADDNAQEAtAIAIdEBQAC1AgAh0gFAALUCACHgAQEAtAIAIewBAQC0AgAh8QECAOwCACHyAQEA3AIAIQrKAQAA8wMAMMsBAAD0AwAQzAEAAPMDADDNAQEAtAIAIdEBQAC1AgAh0gFAALUCACHgAQEAtAIAIewBAQC0AgAh8QECAOwCACHyAQEA3AIAIQbNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHgAQEA-QIAIfEBAgCNAwAh8gEBAP8CACEHBwAArAMAIM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAIeABAQD5AgAh8QECAI0DACHyAQEA_wIAIQcHAACuAwAgzQEBAAAAAdEBQAAAAAHSAUAAAAAB4AEBAAAAAfEBAgAAAAHyAQEAAAABAx4AAOwEACCNAgAA7QQAIJMCAABHACADHgAA6gQAII0CAADrBAAgkwIAAAEAIAQeAADsAwAwjQIAAO0DADCPAgAA7wMAIJMCAADwAwAwBB4AAOMDADCNAgAA5AMAMI8CAADmAwAgkwIAAMYDADAEHgAA2gMAMI0CAADbAwAwjwIAAN0DACCTAgAAmwMAMAAAAAseAACBBAAwHwAAhgQAMI0CAACCBAAwjgIAAIMEADCPAgAAhAQAIJACAACFBAAwkQIAAIUEADCSAgAAhQQAMJMCAACFBAAwlAIAAIcEADCVAgAAiAQAMA4GAAD5AwAgCQAA-gMAIAsAAPsDACANAAD8AwAgzQEBAAAAAdEBQAAAAAHSAUAAAAAB8wEQAAAAAfoBAQAAAAH7AQEAAAAB_AECAAAAAf0BAQAAAAH-AQEAAAABgAIBAAAAAQIAAAAFACAeAACMBAAgAwAAAAUAIB4AAIwEACAfAACLBAAgARcAAOkEADATBQAA9QIAIAYAAMUCACAJAADgAgAgCwAA6gIAIA0AAMYCACDKAQAA9AIAMMsBAAADABDMAQAA9AIAMM0BAQAAAAHRAUAAtQIAIdIBQAC1AgAh8wEQAOgCACH6AQEAtAIAIfsBAQC0AgAh_AECAOwCACH9AQEAtAIAIf4BAQDcAgAh_wEBALQCACGAAgEAtAIAIQIAAAAFACAXAACLBAAgAgAAAIkEACAXAACKBAAgDsoBAACIBAAwywEAAIkEABDMAQAAiAQAMM0BAQC0AgAh0QFAALUCACHSAUAAtQIAIfMBEADoAgAh-gEBALQCACH7AQEAtAIAIfwBAgDsAgAh_QEBALQCACH-AQEA3AIAIf8BAQC0AgAhgAIBALQCACEOygEAAIgEADDLAQAAiQQAEMwBAACIBAAwzQEBALQCACHRAUAAtQIAIdIBQAC1AgAh8wEQAOgCACH6AQEAtAIAIfsBAQC0AgAh_AECAOwCACH9AQEAtAIAIf4BAQDcAgAh_wEBALQCACGAAgEAtAIAIQrNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHzARAAtQMAIfoBAQD5AgAh-wEBAPkCACH8AQIAjQMAIf0BAQD5AgAh_gEBAP8CACGAAgEA-QIAIQ4GAADWAwAgCQAA1wMAIAsAANgDACANAADZAwAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh8wEQALUDACH6AQEA-QIAIfsBAQD5AgAh_AECAI0DACH9AQEA-QIAIf4BAQD_AgAhgAIBAPkCACEOBgAA-QMAIAkAAPoDACALAAD7AwAgDQAA_AMAIM0BAQAAAAHRAUAAAAAB0gFAAAAAAfMBEAAAAAH6AQEAAAAB-wEBAAAAAfwBAgAAAAH9AQEAAAAB_gEBAAAAAYACAQAAAAEEHgAAgQQAMI0CAACCBAAwjwIAAIQEACCTAgAAhQQAMAAAAAABkAIAAACDAgIBkAIgAAAAAQseAADMBAAwHwAA0AQAMI0CAADNBAAwjgIAAM4EADCPAgAAzwQAIJACAACFBAAwkQIAAIUEADCSAgAAhQQAMJMCAACFBAAwlAIAANEEADCVAgAAiAQAMAseAADABAAwHwAAxQQAMI0CAADBBAAwjgIAAMIEADCPAgAAwwQAIJACAADEBAAwkQIAAMQEADCSAgAAxAQAMJMCAADEBAAwlAIAAMYEADCVAgAAxwQAMAseAAC3BAAwHwAAuwQAMI0CAAC4BAAwjgIAALkEADCPAgAAugQAIJACAADwAwAwkQIAAPADADCSAgAA8AMAMJMCAADwAwAwlAIAALwEADCVAgAA8wMAMAceAACyBAAgHwAAtQQAII0CAACzBAAgjgIAALQEACCRAgAAIQAgkgIAACEAIJMCAAC4AQAgCx4AAKYEADAfAACrBAAwjQIAAKcEADCOAgAAqAQAMI8CAACpBAAgkAIAAKoEADCRAgAAqgQAMJICAACqBAAwkwIAAKoEADCUAgAArAQAMJUCAACtBAAwCx4AAJoEADAfAACfBAAwjQIAAJsEADCOAgAAnAQAMI8CAACdBAAgkAIAAJ4EADCRAgAAngQAMJICAACeBAAwkwIAAJ4EADCUAgAAoAQAMJUCAAChBAAwDM0BAQAAAAHRAUAAAAAB0gFAAAAAAd4BAQAAAAHfAQEAAAAB4QEBAAAAAeIBAQAAAAHjAQEAAAAB5AFAAAAAAeUBQAAAAAHmAQEAAAAB5wEBAAAAAQIAAAApACAeAAClBAAgAwAAACkAIB4AAKUEACAfAACkBAAgARcAAOgEADARBwAAxQIAIMoBAADkAgAwywEAACcAEMwBAADkAgAwzQEBAAAAAdEBQAC1AgAh0gFAALUCACHeAQEAtAIAId8BAQC0AgAh4AEBALQCACHhAQEA3AIAIeIBAQDcAgAh4wEBANwCACHkAUAA5QIAIeUBQADlAgAh5gEBANwCACHnAQEA3AIAIQIAAAApACAXAACkBAAgAgAAAKIEACAXAACjBAAgEMoBAAChBAAwywEAAKIEABDMAQAAoQQAMM0BAQC0AgAh0QFAALUCACHSAUAAtQIAId4BAQC0AgAh3wEBALQCACHgAQEAtAIAIeEBAQDcAgAh4gEBANwCACHjAQEA3AIAIeQBQADlAgAh5QFAAOUCACHmAQEA3AIAIecBAQDcAgAhEMoBAAChBAAwywEAAKIEABDMAQAAoQQAMM0BAQC0AgAh0QFAALUCACHSAUAAtQIAId4BAQC0AgAh3wEBALQCACHgAQEAtAIAIeEBAQDcAgAh4gEBANwCACHjAQEA3AIAIeQBQADlAgAh5QFAAOUCACHmAQEA3AIAIecBAQDcAgAhDM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAId4BAQD5AgAh3wEBAPkCACHhAQEA_wIAIeIBAQD_AgAh4wEBAP8CACHkAUAAgAMAIeUBQACAAwAh5gEBAP8CACHnAQEA_wIAIQzNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHeAQEA-QIAId8BAQD5AgAh4QEBAP8CACHiAQEA_wIAIeMBAQD_AgAh5AFAAIADACHlAUAAgAMAIeYBAQD_AgAh5wEBAP8CACEMzQEBAAAAAdEBQAAAAAHSAUAAAAAB3gEBAAAAAd8BAQAAAAHhAQEAAAAB4gEBAAAAAeMBAQAAAAHkAUAAAAAB5QFAAAAAAeYBAQAAAAHnAQEAAAABB80BAQAAAAHQAUAAAAAB0QFAAAAAAdIBQAAAAAHoAQEAAAAB6QEBAAAAAeoBAQAAAAECAAAAJQAgHgAAsQQAIAMAAAAlACAeAACxBAAgHwAAsAQAIAEXAADnBAAwDAcAAMUCACDKAQAA5gIAMMsBAAAjABDMAQAA5gIAMM0BAQAAAAHQAUAAtQIAIdEBQAC1AgAh0gFAALUCACHgAQEAtAIAIegBAQAAAAHpAQEA3AIAIeoBAQDcAgAhAgAAACUAIBcAALAEACACAAAArgQAIBcAAK8EACALygEAAK0EADDLAQAArgQAEMwBAACtBAAwzQEBALQCACHQAUAAtQIAIdEBQAC1AgAh0gFAALUCACHgAQEAtAIAIegBAQC0AgAh6QEBANwCACHqAQEA3AIAIQvKAQAArQQAMMsBAACuBAAQzAEAAK0EADDNAQEAtAIAIdABQAC1AgAh0QFAALUCACHSAUAAtQIAIeABAQC0AgAh6AEBALQCACHpAQEA3AIAIeoBAQDcAgAhB80BAQD5AgAh0AFAAPoCACHRAUAA-gIAIdIBQAD6AgAh6AEBAPkCACHpAQEA_wIAIeoBAQD_AgAhB80BAQD5AgAh0AFAAPoCACHRAUAA-gIAIdIBQAD6AgAh6AEBAPkCACHpAQEA_wIAIeoBAQD_AgAhB80BAQAAAAHQAUAAAAAB0QFAAAAAAdIBQAAAAAHoAQEAAAAB6QEBAAAAAeoBAQAAAAEEDQAApAMAIM0BAQAAAAHRAUAAAAAB0gFAAAAAAQIAAAC4AQAgHgAAsgQAIAMAAAAhACAeAACyBAAgHwAAtgQAIAYAAAAhACANAACWAwAgFwAAtgQAIM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAIQQNAACWAwAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAhBwgAAK8DACDNAQEAAAAB0QFAAAAAAdIBQAAAAAHsAQEAAAAB8QECAAAAAfIBAQAAAAECAAAACwAgHgAAvwQAIAMAAAALACAeAAC_BAAgHwAAvgQAIAEXAADmBAAwAgAAAAsAIBcAAL4EACACAAAA9AMAIBcAAL0EACAGzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh7AEBAPkCACHxAQIAjQMAIfIBAQD_AgAhBwgAAK0DACDNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHsAQEA-QIAIfEBAgCNAwAh8gEBAP8CACEHCAAArwMAIM0BAQAAAAHRAUAAAAAB0gFAAAAAAewBAQAAAAHxAQIAAAAB8gEBAAAAAQcLAADPAwAgzQEBAAAAAdEBQAAAAAHSAUAAAAAB9QEQAAAAAfYBAQAAAAH4AQAAAPgBAgIAAAAeACAeAADLBAAgAwAAAB4AIB4AAMsEACAfAADKBAAgARcAAOUEADAMCgAAxQIAIAsAAOoCACDKAQAA5wIAMMsBAAAcABDMAQAA5wIAMM0BAQAAAAHRAUAAtQIAIdIBQAC1AgAh9QEQAOgCACH2AQEAtAIAIfgBAADpAvgBIvkBAQC0AgAhAgAAAB4AIBcAAMoEACACAAAAyAQAIBcAAMkEACAKygEAAMcEADDLAQAAyAQAEMwBAADHBAAwzQEBALQCACHRAUAAtQIAIdIBQAC1AgAh9QEQAOgCACH2AQEAtAIAIfgBAADpAvgBIvkBAQC0AgAhCsoBAADHBAAwywEAAMgEABDMAQAAxwQAMM0BAQC0AgAh0QFAALUCACHSAUAAtQIAIfUBEADoAgAh9gEBALQCACH4AQAA6QL4ASL5AQEAtAIAIQbNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACH1ARAAtQMAIfYBAQD5AgAh-AEAAL8D-AEiBwsAAMEDACDNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACH1ARAAtQMAIfYBAQD5AgAh-AEAAL8D-AEiBwsAAM8DACDNAQEAAAAB0QFAAAAAAdIBQAAAAAH1ARAAAAAB9gEBAAAAAfgBAAAA-AECDgUAAPgDACAJAAD6AwAgCwAA-wMAIA0AAPwDACDNAQEAAAAB0QFAAAAAAdIBQAAAAAHzARAAAAAB-gEBAAAAAfsBAQAAAAH8AQIAAAAB_QEBAAAAAf4BAQAAAAH_AQEAAAABAgAAAAUAIB4AANQEACADAAAABQAgHgAA1AQAIB8AANMEACABFwAA5AQAMAIAAAAFACAXAADTBAAgAgAAAIkEACAXAADSBAAgCs0BAQD5AgAh0QFAAPoCACHSAUAA-gIAIfMBEAC1AwAh-gEBAPkCACH7AQEA-QIAIfwBAgCNAwAh_QEBAPkCACH-AQEA_wIAIf8BAQD5AgAhDgUAANUDACAJAADXAwAgCwAA2AMAIA0AANkDACDNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHzARAAtQMAIfoBAQD5AgAh-wEBAPkCACH8AQIAjQMAIf0BAQD5AgAh_gEBAP8CACH_AQEA-QIAIQ4FAAD4AwAgCQAA-gMAIAsAAPsDACANAAD8AwAgzQEBAAAAAdEBQAAAAAHSAUAAAAAB8wEQAAAAAfoBAQAAAAH7AQEAAAAB_AECAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAQQeAADMBAAwjQIAAM0EADCPAgAAzwQAIJMCAACFBAAwBB4AAMAEADCNAgAAwQQAMI8CAADDBAAgkwIAAMQEADAEHgAAtwQAMI0CAAC4BAAwjwIAALoEACCTAgAA8AMAMAMeAACyBAAgjQIAALMEACCTAgAAuAEAIAQeAACmBAAwjQIAAKcEADCPAgAAqQQAIJMCAACqBAAwBB4AAJoEADCNAgAAmwQAMI8CAACdBAAgkwIAAJ4EADAAAAIHAAClAwAgDQAApgMAIAAAAAYFAADjBAAgBgAApQMAIAkAANwEACALAADgBAAgDQAApgMAIP4BAAD7AgAgAgoAAKUDACALAADgBAAgAQMAAI4EACAKzQEBAAAAAdEBQAAAAAHSAUAAAAAB8wEQAAAAAfoBAQAAAAH7AQEAAAAB_AECAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAQbNAQEAAAAB0QFAAAAAAdIBQAAAAAH1ARAAAAAB9gEBAAAAAfgBAAAA-AECBs0BAQAAAAHRAUAAAAAB0gFAAAAAAewBAQAAAAHxAQIAAAAB8gEBAAAAAQfNAQEAAAAB0AFAAAAAAdEBQAAAAAHSAUAAAAAB6AEBAAAAAekBAQAAAAHqAQEAAAABDM0BAQAAAAHRAUAAAAAB0gFAAAAAAd4BAQAAAAHfAQEAAAAB4QEBAAAAAeIBAQAAAAHjAQEAAAAB5AFAAAAAAeUBQAAAAAHmAQEAAAAB5wEBAAAAAQrNAQEAAAAB0QFAAAAAAdIBQAAAAAHzARAAAAAB-gEBAAAAAfsBAQAAAAH8AQIAAAAB_QEBAAAAAf4BAQAAAAGAAgEAAAABEQkAANcEACAOAADYBAAgDwAA1gQAIBAAANkEACARAADaBAAgzQEBAAAAAdEBQAAAAAHSAUAAAAAB5wEBAAAAAfoBAQAAAAGBAgEAAAABgwIAAACDAgKEAiAAAAABhQIBAAAAAYYCAQAAAAGHAiAAAAABiAIBAAAAAQIAAAABACAeAADqBAAgBM0BAQAAAAHRAUAAAAAB0gFAAAAAAfoBAQAAAAECAAAARwAgHgAA7AQAIAbNAQEAAAAB0QFAAAAAAdIBQAAAAAHgAQEAAAAB8QECAAAAAfIBAQAAAAEGzQEBAAAAAdEBQAAAAAHSAUAAAAAB7QECAAAAAfMBEAAAAAH0AQEAAAABA80BAQAAAAHrAQEAAAAB7QECAAAAAQMAAAAxACAeAADqBAAgHwAA8wQAIBMAAAAxACAJAACWBAAgDgAAlwQAIA8AAJUEACAQAACYBAAgEQAAmQQAIBcAAPMEACDNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHnAQEA_wIAIfoBAQD5AgAhgQIBAPkCACGDAgAAkgSDAiKEAiAAkwQAIYUCAQD_AgAhhgIBAP8CACGHAiAAkwQAIYgCAQD_AgAhEQkAAJYEACAOAACXBAAgDwAAlQQAIBAAAJgEACARAACZBAAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh5wEBAP8CACH6AQEA-QIAIYECAQD5AgAhgwIAAJIEgwIihAIgAJMEACGFAgEA_wIAIYYCAQD_AgAhhwIgAJMEACGIAgEA_wIAIQMAAABKACAeAADsBAAgHwAA9gQAIAYAAABKACAXAAD2BAAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh-gEBAPkCACEEzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh-gEBAPkCACERAwAA1QQAIAkAANcEACAOAADYBAAgEAAA2QQAIBEAANoEACDNAQEAAAAB0QFAAAAAAdIBQAAAAAHnAQEAAAAB-gEBAAAAAYECAQAAAAGDAgAAAIMCAoQCIAAAAAGFAgEAAAABhgIBAAAAAYcCIAAAAAGIAgEAAAABAgAAAAEAIB4AAPcEACAGzQEBAAAAAdEBQAAAAAHSAUAAAAAB7AEBAAAAAe0BAgAAAAHzARAAAAABAwAAADEAIB4AAPcEACAfAAD8BAAgEwAAADEAIAMAAJQEACAJAACWBAAgDgAAlwQAIBAAAJgEACARAACZBAAgFwAA_AQAIM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAIecBAQD_AgAh-gEBAPkCACGBAgEA-QIAIYMCAACSBIMCIoQCIACTBAAhhQIBAP8CACGGAgEA_wIAIYcCIACTBAAhiAIBAP8CACERAwAAlAQAIAkAAJYEACAOAACXBAAgEAAAmAQAIBEAAJkEACDNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHnAQEA_wIAIfoBAQD5AgAhgQIBAPkCACGDAgAAkgSDAiKEAiAAkwQAIYUCAQD_AgAhhgIBAP8CACGHAiAAkwQAIYgCAQD_AgAhDwUAAPgDACAGAAD5AwAgCQAA-gMAIA0AAPwDACDNAQEAAAAB0QFAAAAAAdIBQAAAAAHzARAAAAAB-gEBAAAAAfsBAQAAAAH8AQIAAAAB_QEBAAAAAf4BAQAAAAH_AQEAAAABgAIBAAAAAQIAAAAFACAeAAD9BAAgCAoAAM4DACDNAQEAAAAB0QFAAAAAAdIBQAAAAAH1ARAAAAAB9gEBAAAAAfgBAAAA-AEC-QEBAAAAAQIAAAAeACAeAAD_BAAgAwAAAAMAIB4AAP0EACAfAACDBQAgEQAAAAMAIAUAANUDACAGAADWAwAgCQAA1wMAIA0AANkDACAXAACDBQAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh8wEQALUDACH6AQEA-QIAIfsBAQD5AgAh_AECAI0DACH9AQEA-QIAIf4BAQD_AgAh_wEBAPkCACGAAgEA-QIAIQ8FAADVAwAgBgAA1gMAIAkAANcDACANAADZAwAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh8wEQALUDACH6AQEA-QIAIfsBAQD5AgAh_AECAI0DACH9AQEA-QIAIf4BAQD_AgAh_wEBAPkCACGAAgEA-QIAIQMAAAAcACAeAAD_BAAgHwAAhgUAIAoAAAAcACAKAADAAwAgFwAAhgUAIM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAIfUBEAC1AwAh9gEBAPkCACH4AQAAvwP4ASL5AQEA-QIAIQgKAADAAwAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh9QEQALUDACH2AQEA-QIAIfgBAAC_A_gBIvkBAQD5AgAhDwUAAPgDACAGAAD5AwAgCwAA-wMAIA0AAPwDACDNAQEAAAAB0QFAAAAAAdIBQAAAAAHzARAAAAAB-gEBAAAAAfsBAQAAAAH8AQIAAAAB_QEBAAAAAf4BAQAAAAH_AQEAAAABgAIBAAAAAQIAAAAFACAeAACHBQAgEQMAANUEACAOAADYBAAgDwAA1gQAIBAAANkEACARAADaBAAgzQEBAAAAAdEBQAAAAAHSAUAAAAAB5wEBAAAAAfoBAQAAAAGBAgEAAAABgwIAAACDAgKEAiAAAAABhQIBAAAAAYYCAQAAAAGHAiAAAAABiAIBAAAAAQIAAAABACAeAACJBQAgAwAAAAMAIB4AAIcFACAfAACNBQAgEQAAAAMAIAUAANUDACAGAADWAwAgCwAA2AMAIA0AANkDACAXAACNBQAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh8wEQALUDACH6AQEA-QIAIfsBAQD5AgAh_AECAI0DACH9AQEA-QIAIf4BAQD_AgAh_wEBAPkCACGAAgEA-QIAIQ8FAADVAwAgBgAA1gMAIAsAANgDACANAADZAwAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh8wEQALUDACH6AQEA-QIAIfsBAQD5AgAh_AECAI0DACH9AQEA-QIAIf4BAQD_AgAh_wEBAPkCACGAAgEA-QIAIQMAAAAxACAeAACJBQAgHwAAkAUAIBMAAAAxACADAACUBAAgDgAAlwQAIA8AAJUEACAQAACYBAAgEQAAmQQAIBcAAJAFACDNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHnAQEA_wIAIfoBAQD5AgAhgQIBAPkCACGDAgAAkgSDAiKEAiAAkwQAIYUCAQD_AgAhhgIBAP8CACGHAiAAkwQAIYgCAQD_AgAhEQMAAJQEACAOAACXBAAgDwAAlQQAIBAAAJgEACARAACZBAAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh5wEBAP8CACH6AQEA-QIAIYECAQD5AgAhgwIAAJIEgwIihAIgAJMEACGFAgEA_wIAIYYCAQD_AgAhhwIgAJMEACGIAgEA_wIAIREDAADVBAAgCQAA1wQAIA8AANYEACAQAADZBAAgEQAA2gQAIM0BAQAAAAHRAUAAAAAB0gFAAAAAAecBAQAAAAH6AQEAAAABgQIBAAAAAYMCAAAAgwIChAIgAAAAAYUCAQAAAAGGAgEAAAABhwIgAAAAAYgCAQAAAAECAAAAAQAgHgAAkQUAIAPNAQEAAAAB7AEBAAAAAe0BAgAAAAEDAAAAMQAgHgAAkQUAIB8AAJYFACATAAAAMQAgAwAAlAQAIAkAAJYEACAPAACVBAAgEAAAmAQAIBEAAJkEACAXAACWBQAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh5wEBAP8CACH6AQEA-QIAIYECAQD5AgAhgwIAAJIEgwIihAIgAJMEACGFAgEA_wIAIYYCAQD_AgAhhwIgAJMEACGIAgEA_wIAIREDAACUBAAgCQAAlgQAIA8AAJUEACAQAACYBAAgEQAAmQQAIM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAIecBAQD_AgAh-gEBAPkCACGBAgEA-QIAIYMCAACSBIMCIoQCIACTBAAhhQIBAP8CACGGAgEA_wIAIYcCIACTBAAhiAIBAP8CACEPBQAA-AMAIAYAAPkDACAJAAD6AwAgCwAA-wMAIM0BAQAAAAHRAUAAAAAB0gFAAAAAAfMBEAAAAAH6AQEAAAAB-wEBAAAAAfwBAgAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABAgAAAAUAIB4AAJcFACAFBwAAowMAIM0BAQAAAAHRAUAAAAAB0gFAAAAAAeABAQAAAAECAAAAuAEAIB4AAJkFACADAAAAAwAgHgAAlwUAIB8AAJ0FACARAAAAAwAgBQAA1QMAIAYAANYDACAJAADXAwAgCwAA2AMAIBcAAJ0FACDNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHzARAAtQMAIfoBAQD5AgAh-wEBAPkCACH8AQIAjQMAIf0BAQD5AgAh_gEBAP8CACH_AQEA-QIAIYACAQD5AgAhDwUAANUDACAGAADWAwAgCQAA1wMAIAsAANgDACDNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHzARAAtQMAIfoBAQD5AgAh-wEBAPkCACH8AQIAjQMAIf0BAQD5AgAh_gEBAP8CACH_AQEA-QIAIYACAQD5AgAhAwAAACEAIB4AAJkFACAfAACgBQAgBwAAACEAIAcAAJUDACAXAACgBQAgzQEBAPkCACHRAUAA-gIAIdIBQAD6AgAh4AEBAPkCACEFBwAAlQMAIM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAIeABAQD5AgAhEQMAANUEACAJAADXBAAgDgAA2AQAIA8AANYEACARAADaBAAgzQEBAAAAAdEBQAAAAAHSAUAAAAAB5wEBAAAAAfoBAQAAAAGBAgEAAAABgwIAAACDAgKEAiAAAAABhQIBAAAAAYYCAQAAAAGHAiAAAAABiAIBAAAAAQIAAAABACAeAAChBQAgAwAAADEAIB4AAKEFACAfAAClBQAgEwAAADEAIAMAAJQEACAJAACWBAAgDgAAlwQAIA8AAJUEACARAACZBAAgFwAApQUAIM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAIecBAQD_AgAh-gEBAPkCACGBAgEA-QIAIYMCAACSBIMCIoQCIACTBAAhhQIBAP8CACGGAgEA_wIAIYcCIACTBAAhiAIBAP8CACERAwAAlAQAIAkAAJYEACAOAACXBAAgDwAAlQQAIBEAAJkEACDNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHnAQEA_wIAIfoBAQD5AgAhgQIBAPkCACGDAgAAkgSDAiKEAiAAkwQAIYUCAQD_AgAhhgIBAP8CACGHAiAAkwQAIYgCAQD_AgAhEQMAANUEACAJAADXBAAgDgAA2AQAIA8AANYEACAQAADZBAAgzQEBAAAAAdEBQAAAAAHSAUAAAAAB5wEBAAAAAfoBAQAAAAGBAgEAAAABgwIAAACDAgKEAiAAAAABhQIBAAAAAYYCAQAAAAGHAiAAAAABiAIBAAAAAQIAAAABACAeAACmBQAgAwAAADEAIB4AAKYFACAfAACqBQAgEwAAADEAIAMAAJQEACAJAACWBAAgDgAAlwQAIA8AAJUEACAQAACYBAAgFwAAqgUAIM0BAQD5AgAh0QFAAPoCACHSAUAA-gIAIecBAQD_AgAh-gEBAPkCACGBAgEA-QIAIYMCAACSBIMCIoQCIACTBAAhhQIBAP8CACGGAgEA_wIAIYcCIACTBAAhiAIBAP8CACERAwAAlAQAIAkAAJYEACAOAACXBAAgDwAAlQQAIBAAAJgEACDNAQEA-QIAIdEBQAD6AgAh0gFAAPoCACHnAQEA_wIAIfoBAQD5AgAhgQIBAPkCACGDAgAAkgSDAiKEAiAAkwQAIYUCAQD_AgAhhgIBAP8CACGHAiAAkwQAIYgCAQD_AgAhBwMGAgQADwkgBQ4iCg8fBxAmDREqDgYEAAwFAAMGAAEJDAULEAYNFgkCAwcCBAAEAQMIAAIHAAEIAAICCAACDAAHAwQACAoAAQsRBgELEgACCAACDgAKAwQACwcAAQ0XCQENGAADCRkACxoADRsAAQcAAQEHAAEFAysACS0ADywAEC4AES8AAAAAAwQAFCQAFSUAFgAAAAMEABQkABUlABYAAAMEABskABwlAB0AAAADBAAbJAAcJQAdAgUAAwYAAQIFAAMGAAEFBAAiJAAlJQAmRgAjRwAkAAAAAAAFBAAiJAAlJQAmRgAjRwAkAQoAAQEKAAEFBAArJAAuJQAvRgAsRwAtAAAAAAAFBAArJAAuJQAvRgAsRwAtAggAAgwABwIIAAIMAAcFBAA0JAA3JQA4RgA1RwA2AAAAAAAFBAA0JAA3JQA4RgA1RwA2AgcAAQgAAgIHAAEIAAIFBAA9JABAJQBBRgA-RwA_AAAAAAAFBAA9JABAJQBBRgA-RwA_AQcAAQEHAAEDBABGJABHJQBIAAAAAwQARiQARyUASAIIAAIOAAoCCAACDgAKBQQATSQAUCUAUUYATkcATwAAAAAABQQATSQAUCUAUUYATkcATwEHAAEBBwABAwQAViQAVyUAWAAAAAMEAFYkAFclAFgBBwABAQcAAQMEAF0kAF4lAF8AAAADBABdJABeJQBfAAAAAwQAZSQAZiUAZwAAAAMEAGUkAGYlAGcSAgETMAEUMwEVNAEWNQEYNwEZORAaOhEbPAEcPhAdPxIgQAEhQQEiQhAmRRMnRhcoSAMpSQMqTAMrTQMsTgMtUAMuUhAvUxgwVQMxVxAyWBkzWQM0WgM1WxA2Xho3Xx44YAI5YQI6YgI7YwI8ZAI9ZgI-aBA_aR9AawJBbRBCbiBDbwJEcAJFcRBIdCFJdSdKdgdLdwdMeAdNeQdOegdPfAdQfhBRfyhSgQEHU4MBEFSEASlVhQEHVoYBB1eHARBYigEqWYsBMFqMAQZbjQEGXI4BBl2PAQZekAEGX5IBBmCUARBhlQExYpcBBmOZARBkmgEyZZsBBmacAQZnnQEQaKABM2mhATlqogEFa6MBBWykAQVtpQEFbqYBBW-oAQVwqgEQcasBOnKtAQVzrwEQdLABO3WxAQV2sgEFd7MBEHi2ATx5twFCerkBCnu6AQp8vAEKfb0BCn6-AQp_wAEKgAHCARCBAcMBQ4IBxQEKgwHHARCEAcgBRIUByQEKhgHKAQqHAcsBEIgBzgFFiQHPAUmKAdABCYsB0QEJjAHSAQmNAdMBCY4B1AEJjwHWAQmQAdgBEJEB2QFKkgHbAQmTAd0BEJQB3gFLlQHfAQmWAeABCZcB4QEQmAHkAUyZAeUBUpoB5gENmwHnAQ2cAegBDZ0B6QENngHqAQ2fAewBDaAB7gEQoQHvAVOiAfEBDaMB8wEQpAH0AVSlAfUBDaYB9gENpwH3ARCoAfoBVakB-wFZqgH8AQ6rAf0BDqwB_gEOrQH_AQ6uAYACDq8BggIOsAGEAhCxAYUCWrIBhwIOswGJAhC0AYoCW7UBiwIOtgGMAg63AY0CELgBkAJcuQGRAmC6AZMCYbsBlAJhvAGXAmG9AZgCYb4BmQJhvwGbAmHAAZ0CEMEBngJiwgGgAmHDAaICEMQBowJjxQGkAmHGAaUCYccBpgIQyAGpAmTJAaoCaA"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/enums.ts
var Role = {
  CUSTOMER: "CUSTOMER",
  SELLER: "SELLER",
  ADMIN: "ADMIN"
};
var OrderStatus = {
  PLACED: "PLACED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

// src/generated/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
if (process.env.NODE_ENV !== "production") {
  await import("./main-3I6C6KNF.js").then((dotenv) => dotenv.config());
}
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import { oAuthProxy } from "better-auth/plugins";
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  baseURL: process.env.APP_URL,
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  advanced: {
    cookies: {
      session_token: {
        name: "session_token",
        // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true
        }
      },
      state: {
        name: "session_token",
        // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true
        }
      }
    }
  },
  plugins: [oAuthProxy()]
});

// src/app.ts
import cors from "cors";

// src/modules/medicine/medicine.router.ts
import express from "express";

// src/modules/medicine/medicine.service.ts
var createMedicine = async (data, sellerId) => {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId }
  });
  if (!category) {
    throw new Error("Category not found");
  }
  const result = await prisma.medicine.create({
    data: {
      ...data,
      sellerId
    }
  });
  return result;
};
var getAllMedicine = async (payload) => {
  const whereCondition = {};
  if (payload.search) {
    whereCondition.OR = [
      {
        name: {
          contains: payload.search,
          mode: "insensitive"
        }
      },
      {
        description: {
          contains: payload.search,
          mode: "insensitive"
        }
      },
      {
        manufacturer: {
          contains: payload.search,
          mode: "insensitive"
        }
      }
    ];
  }
  if (payload.category) {
    whereCondition.category = {
      name: {
        equals: payload.category,
        mode: "insensitive"
      }
    };
  }
  if (payload.manufacturer) {
    whereCondition.manufacturer = {
      contains: payload.manufacturer,
      mode: "insensitive"
    };
  }
  const total = await prisma.medicine.count({
    where: whereCondition
  });
  const result = await prisma.medicine.findMany({
    where: whereCondition,
    skip: payload.skip,
    take: payload.limit,
    include: {
      category: true
    }
  });
  return {
    pagination: {
      page: payload.page,
      limit: payload.limit,
      total,
      totalPage: Math.ceil(total / payload.limit)
    },
    data: result
  };
};
var getMedicineById = async (medicineId) => {
  const result = await prisma.medicine.findUnique({
    where: {
      id: medicineId
    },
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          name: true
        }
      },
      reviews: true
    }
  });
  return result;
};
var updateMedicineById = async (medicineId, sellerId, data) => {
  const existing = await prisma.medicine.findFirst({
    where: {
      id: medicineId,
      sellerId
    }
  });
  if (!existing) {
    throw new Error("Not authorized or medicine not found");
  }
  const result = await prisma.medicine.update({
    where: {
      id: medicineId
    },
    data
  });
  return result;
};
var deleteMedicineById = async (medicineId) => {
  const result = await prisma.medicine.delete({
    where: {
      id: medicineId
    }
  });
  return result;
};
var medicineService = {
  createMedicine,
  getAllMedicine,
  getMedicineById,
  updateMedicineById,
  deleteMedicineById
};

// src/helpers/Pagination.ts
var paginationHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 8;
  const skip = (page - 1) * limit;
  return {
    page,
    limit,
    skip
  };
};
var Pagination_default = paginationHelper;

// src/modules/medicine/medicine.controller.ts
var createMedicine2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user?.id) {
      throw new Error("Unauthorized");
    }
    const result = await medicineService.createMedicine(
      {
        ...req.body,
        price: Number(req.body.price),
        stock: Number(req.body.stock)
      },
      user.id
    );
    res.status(201).json({
      success: true,
      message: "Medicine Created Successfully",
      data: result
    });
  } catch (e) {
    res.status(400).json({
      error: "Medicine Creation Failed",
      details: e.message || String(e)
    });
  }
};
var getAllMedicine2 = async (req, res) => {
  try {
    const { search, category, manufacturer, price, minPrice, maxPrice } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const categoryString = typeof category === "string" ? category : void 0;
    const manufacturerString = typeof manufacturer === "string" ? manufacturer : void 0;
    const parsedPrice = typeof price === "string" ? Number(price) : void 0;
    const parsedMinPrice = typeof minPrice === "string" ? Number(minPrice) : void 0;
    const parsedMaxPrice = typeof maxPrice === "string" ? Number(maxPrice) : void 0;
    const { page, limit, skip } = Pagination_default(req.query);
    const result = await medicineService.getAllMedicine({
      search: searchString,
      category: categoryString,
      manufacturer: manufacturerString,
      price: parsedPrice,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
      page,
      limit,
      skip
    });
    res.status(200).json({
      success: true,
      message: "Medicine Fetched Successfully",
      data: result
    });
  } catch (e) {
    res.status(400).json({
      error: "Medicine fetch failed",
      details: e
    });
  }
};
var getMedicineById2 = async (req, res) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId) {
      throw new Error("Medicine ID is required");
    }
    const result = await medicineService.getMedicineById(medicineId);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Get medicine by id failed",
      details: e
    });
  }
};
var updateMedicineById2 = async (req, res) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId || Array.isArray(medicineId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Medicine ID"
      });
    }
    const user = req.user;
    const data = { ...req.body };
    const updatedMedicine = await medicineService.updateMedicineById(
      medicineId,
      user?.id,
      data
    );
    res.status(200).json({
      success: true,
      message: "Medicine Updated Successfully",
      data: updatedMedicine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong"
    });
  }
};
var deleteMedicineById2 = async (req, res) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId) {
      throw new Error("Medicine ID is required");
    }
    const deletedMedicine = await medicineService.deleteMedicineById(medicineId);
    if (!deletedMedicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong"
    });
  }
};
var MedicineController = {
  createMedicine: createMedicine2,
  getAllMedicine: getAllMedicine2,
  getMedicineById: getMedicineById2,
  updateMedicineById: updateMedicineById2,
  deleteMedicineById: deleteMedicineById2
};

// src/middlewares/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized"
      });
    }
    if (!session.user.emailVerified) {
      return res.status(401).json({
        success: false,
        message: "Email verification required. Please verify your email!"
      });
    }
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      emailVerified: session.user.emailVerified
    };
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden! You don't have permission to access this resources!"
      });
    }
    next();
    console.log(session);
  };
};
var auth_default = auth2;

// src/modules/medicine/medicine.router.ts
var router = express.Router();
router.post(
  "/seller/medicines",
  auth_default("SELLER" /* SELLER */),
  MedicineController.createMedicine
);
router.get("/medicines", MedicineController.getAllMedicine);
router.get("/medicines/:medicineId", MedicineController.getMedicineById);
router.patch(
  "/seller/medicines/:medicineId",
  auth_default("SELLER" /* SELLER */),
  MedicineController.updateMedicineById
);
router.delete("/seller/medicines/:medicineId", auth_default("SELLER" /* SELLER */), MedicineController.deleteMedicineById);
var medicineRouter = router;

// src/modules/category/category.router.ts
import express2 from "express";

// src/modules/category/category.service.ts
var createCategory = async (data) => {
  const result = await prisma.category.create({
    data
  });
  return result;
};
var getAllCategory = async () => {
  return await prisma.category.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
};
var deleteCategoryById = async (categoryId) => {
  const result = await prisma.category.delete({
    where: {
      id: categoryId
    }
  });
  return result;
};
var categoryService = {
  createCategory,
  getAllCategory,
  deleteCategoryById
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Category creation failed",
      error
    });
  }
};
var getAllCategory2 = async (req, res) => {
  try {
    const result = await categoryService.getAllCategory();
    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Category fetch failed"
    });
  }
};
var deleteCategoryById2 = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      throw new Error("Category ID is required");
    }
    const deletedCategory = await categoryService.deleteCategoryById(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong"
    });
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategory: getAllCategory2,
  deleteCategoryById: deleteCategoryById2
};

// src/modules/category/category.router.ts
var router2 = express2.Router();
router2.post("/", auth_default("ADMIN" /* ADMIN */), categoryController.createCategory);
router2.get("/", categoryController.getAllCategory);
router2.delete("/:categoryId", auth_default("ADMIN" /* ADMIN */), categoryController.deleteCategoryById);
var categoryRouter = router2;

// src/modules/order/order.route.ts
import express3 from "express";

// src/modules/order/order.service.ts
var createOrder = async (data) => {
  return await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItemsData = [];
    for (const item of data.items) {
      const medicine = await tx.medicine.findUnique({
        where: { id: item.medicineId }
      });
      if (!medicine) {
        throw new Error("Medicine is not found");
      }
      if (medicine.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${medicine.name}`);
      }
      const itemTotal = Number(medicine.price) * item.quantity;
      totalAmount = totalAmount + itemTotal;
      orderItemsData.push({
        medicineId: item.medicineId,
        quantity: item.quantity,
        price: medicine.price
      });
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }
    const order = await tx.order.create({
      data: {
        customerId: data.customerId,
        shippingAddress: data.shippingAddress,
        totalAmount,
        status: OrderStatus.PLACED,
        orderItems: {
          create: orderItemsData
        }
      },
      include: {
        orderItems: true
      }
    });
    await tx.cartItem.deleteMany({
      where: {
        cart: {
          userId: data.customerId
        }
      }
    });
    return order;
  });
};
var getOwnOrder = async (customerId, role) => {
  if (role === "ADMIN") {
    const result2 = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
    return result2;
  }
  const result = await prisma.order.findMany({
    where: {
      customerId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return { result };
};
var getOrderById = async (orderId, userId, role) => {
  const result = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          medicine: true
        }
      },
      customer: true
    }
  });
  if (!result) {
    throw new Error("Order Not found");
  }
  if (role === "ADMIN") {
    return result;
  }
  if (role === "CUSTOMER") {
    if (result.customerId === userId) {
      return result;
    } else {
      throw new Error("Not Authorized");
    }
  }
  if (role === "SELLER") {
    const sellerItems = result.orderItems.some(
      (item) => item.medicine.sellerId === userId
    );
    if (sellerItems) {
      return result;
    } else {
      throw new Error("Not Authorized");
    }
  }
};
var orderService = {
  createOrder,
  getOwnOrder,
  getOrderById
};

// src/modules/order/order.controller.ts
var createOrder2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user?.id) {
      throw new Error("Unauthorized");
    }
    const result = await orderService.createOrder({
      customerId: user.id,
      shippingAddress: req.body.shippingAddress,
      items: req.body.items
    });
    res.status(201).json({
      success: true,
      message: "Order Created Successfully",
      data: {
        ...result,
        totalAmount: Number(result.totalAmount)
      }
    });
  } catch (e) {
    console.log("error", e);
    res.status(400).json({
      error: "Order creation failed",
      message: e.message
    });
  }
};
var getOwnOrder2 = async (req, res) => {
  try {
    const user = req.user;
    const result = await orderService.getOwnOrder(
      user?.id,
      user?.role
    );
    res.status(200).json({
      success: true,
      message: "Order Fetched Successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Fetch order failed"
    });
  }
};
var getOrderById2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const { orderId } = req.params;
    const result = await orderService.getOrderById(orderId, user?.id, user?.role);
    res.status(200).json(result);
  } catch (error) {
    let statusCode = 500;
    if (error.message === "Not Authorized") {
      statusCode = 403;
    }
    if (error.message === "Order Not found") {
      statusCode = 404;
    }
    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};
var OrderController = {
  createOrder: createOrder2,
  getOwnOrder: getOwnOrder2,
  getOrderById: getOrderById2
};

// src/modules/order/order.route.ts
var router3 = express3.Router();
router3.post("/", auth_default("CUSTOMER" /* CUSTOMER */), OrderController.createOrder);
router3.get("/", auth_default("CUSTOMER" /* CUSTOMER */, "ADMIN" /* ADMIN */), OrderController.getOwnOrder);
router3.get("/:orderId", auth_default("CUSTOMER" /* CUSTOMER */, "ADMIN" /* ADMIN */, "SELLER" /* SELLER */), OrderController.getOrderById);
var orderRouter = router3;

// src/modules/seller/seller.route.ts
import express4 from "express";

// src/modules/seller/seller.service.ts
var getSellerOrders = async (sellerId) => {
  const result = await prisma.order.findMany({
    where: {
      orderItems: {
        some: {
          medicine: {
            sellerId
            //DB medicine has sellerId
          }
        }
      }
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      orderItems: {
        where: {
          medicine: {
            sellerId
          }
        },
        include: {
          medicine: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var updateOrderStatusBySeller = async (orderId, sellerId, status) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          medicine: true
        }
      }
    }
  });
  if (!order) {
    throw new Error("Order not found");
  }
  const isSellerOrder = order.orderItems.some(
    (item) => item.medicine.sellerId === sellerId
  );
  if (!isSellerOrder) {
    throw new Error("You are not allowed to update this order");
  }
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status
    }
  });
  return updatedOrder;
};
var updateMedicineBySeller = async (medicineId, sellerId, payload) => {
  const existingMedicine = await prisma.medicine.findFirst({
    where: {
      id: medicineId,
      sellerId
    }
  });
  if (!existingMedicine) {
    throw new Error("Medicine not found or unauthorized");
  }
  const updatedMedicine = await prisma.medicine.update({
    where: {
      id: medicineId
    },
    data: {
      ...payload.name && { name: payload.name },
      ...payload.description && { description: payload.description },
      ...payload.price && { price: Number(payload.price) },
      ...payload.stock !== void 0 && { stock: Number(payload.stock) },
      ...payload.manufacturer && { manufacturer: payload.manufacturer },
      ...payload.imageURL && { imageURL: payload.imageURL },
      ...payload.categoryId && { categoryId: payload.categoryId }
    }
  });
  return updatedMedicine;
};
var SellerService = {
  getSellerOrders,
  updateOrderStatusBySeller,
  updateMedicineBySeller
};

// src/modules/seller/seller.controller.ts
var getSellerOrders2 = async (req, res) => {
  try {
    if (!req.user || req.user.role !== Role.SELLER) {
      throw new Error("Unauthorized");
    }
    const user = req.user;
    console.log("Seller is", user);
    const result = await SellerService.getSellerOrders(user.id);
    res.status(200).json({
      success: true,
      count: result.length,
      message: "Fetched Order Successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Order Fetch failed"
    });
  }
};
var updateOrderStatusBySeller2 = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = req.user;
    const { status } = req.body;
    if (!user || user.role !== Role.SELLER) {
      throw new Error("Unauthorized");
    }
    if (!status) {
      throw new Error("Status is required");
    }
    const updatedStatus = status.trim().toUpperCase();
    if (!Object.values(OrderStatus).includes(updatedStatus)) {
      throw new Error("Invalid Status");
    }
    const result = await SellerService.updateOrderStatusBySeller(orderId, user.id, status);
    res.status(200).json({
      success: true,
      message: "Update Order Successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Order Updated failed"
    });
  }
};
var updateMedicineBySeller2 = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const user = req.user;
    if (!user || user.role !== Role.SELLER) {
      throw new Error("Unauthorized");
    }
    const result = await SellerService.updateMedicineBySeller(medicineId, user.id, req.body);
    res.status(200).json({
      success: true,
      message: "Update Medicine Successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Medicine Updated failed"
    });
  }
};
var SellerController = {
  getSellerOrders: getSellerOrders2,
  updateOrderStatusBySeller: updateOrderStatusBySeller2,
  updateMedicineBySeller: updateMedicineBySeller2
};

// src/modules/seller/seller.route.ts
var router4 = express4.Router();
router4.get("/orders/", auth_default("SELLER" /* SELLER */), SellerController.getSellerOrders);
router4.patch("/orders/:orderId", auth_default("SELLER" /* SELLER */), SellerController.updateOrderStatusBySeller);
router4.put("/medicines/:medicineId", auth_default("SELLER" /* SELLER */), SellerController.updateMedicineBySeller);
var sellerRouter = router4;

// src/modules/cart/cart.route.ts
import express5 from "express";

// src/modules/cart/cart.service.ts
var createCart = async (payload, userId) => {
  const { medicineId, quantity } = payload;
  if (!medicineId || !quantity) {
    throw new Error("Medicine Id and quantity are required");
  }
  if (quantity <= 0) {
    throw new Error("Quantity must be grater than 0");
  }
  const medicine = await prisma.medicine.findUnique({
    where: {
      id: medicineId
    }
  });
  if (!medicine) {
    throw new Error("Medicine not found");
  }
  if (medicine.stock < quantity) {
    throw new Error("Insufficient Stock");
  }
  let cart = await prisma.cart.findUnique({
    where: {
      userId
    }
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId }
    });
  }
  const existingItem = await prisma.cartItem.findFirst(
    {
      where: {
        cartId: cart.id,
        medicineId
      }
    }
  );
  if (existingItem) {
    if (medicine.stock < existingItem.quantity + quantity) {
      throw new Error("Stock Limit exceeded");
    }
  }
  if (existingItem) {
    const updateCartItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem?.quantity + quantity
      }
    });
    await prisma.medicine.update({
      where: { id: medicineId },
      data: { stock: medicine.stock - quantity }
    });
    return updateCartItem;
  }
  const result = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      medicineId,
      quantity
    }
  });
  await prisma.medicine.update({
    where: { id: medicineId },
    data: { stock: medicine.stock - quantity }
  });
  return result;
};
var getAllOwnCartItems = async (customerId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: customerId },
    include: {
      cartItems: {
        include: {
          medicine: true
        }
      }
    }
  });
  if (!cart) {
    return {
      cartItems: [],
      totalPrice: 0
    };
  }
  const totalPrice = cart.cartItems.reduce((total, item) => {
    return total + item.quantity * item.medicine.price.toNumber();
  }, 0);
  return {
    items: cart.cartItems,
    totalPrice
  };
};
var deleteCartItem = async (cartItemId, userId) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true, medicine: true }
  });
  if (!item) throw new Error("Cart item not found");
  if (item.cart.userId !== userId) {
    throw new Error("Unauthorized");
  }
  await prisma.medicine.update({
    where: { id: item.medicineId },
    data: {
      stock: item.medicine.stock + item.quantity
    }
  });
  return await prisma.cartItem.delete({
    where: { id: cartItemId }
  });
};
var cartService = {
  createCart,
  // deleteCart,
  getAllOwnCartItems,
  deleteCartItem
};

// src/modules/cart/cart.controller.ts
var createCart2 = async (req, res) => {
  try {
    const user = req.user;
    const result = await cartService.createCart(req.body, user.id);
    res.status(201).json({
      success: true,
      message: "Items added to Cart successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Cart creation failed",
      error
    });
  }
};
var getAllOwnCartItems2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const result = await cartService.getAllOwnCartItems(user.id);
    return res.status(200).json({
      success: true,
      message: "Cart Items fetched successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Cart Items fetch failed"
    });
  }
};
var deleteCartItem2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new Error("Unauthorized");
    const { cartItemId } = req.params;
    const result = await cartService.deleteCartItem(cartItemId, user.id);
    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var cartController = {
  createCart: createCart2,
  //  deleteCart,
  getAllOwnCartItems: getAllOwnCartItems2,
  deleteCartItem: deleteCartItem2
};

// src/modules/cart/cart.route.ts
var router5 = express5.Router();
router5.post("/", auth_default("CUSTOMER" /* CUSTOMER */), cartController.createCart);
router5.get("/", auth_default("CUSTOMER" /* CUSTOMER */), cartController.getAllOwnCartItems);
router5.delete("/item/:cartItemId", auth_default("CUSTOMER" /* CUSTOMER */), cartController.deleteCartItem);
var cartRouter = router5;

// src/modules/profile/profile.route.ts
import express6 from "express";

// src/modules/profile/profile.service.ts
var getProfileInfoByUser = async (userId) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      image: true,
      role: true,
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          medicineId: true,
          createdAt: true
        }
      }
    }
  });
  if (!result) {
    throw new Error("User Not Found");
  }
  return result;
};
var updateProfileInfo = async (userId, data) => {
  console.log("Update profile info", userId);
  const result = await prisma.user.update({
    where: {
      id: userId
    },
    data
  });
  return result;
};
var profileService = {
  getProfileInfoByUser,
  updateProfileInfo
};

// src/modules/profile/profile.controller.ts
var getProfileInfoByUser2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user?.id) {
      throw new Error("Unauthorized");
    }
    const result = await profileService.getProfileInfoByUser(user.id);
    res.status(200).json({
      success: true,
      message: "Profile Fetched Successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Fetch Profile Information Failed"
    });
  }
};
var updateProfileInfo2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user?.id) {
      throw new Error("Unauthorized");
    }
    const result = await profileService.updateProfileInfo(user.id, req.body);
    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Fetch Profile Information Failed"
    });
  }
};
var ProfileController = {
  getProfileInfoByUser: getProfileInfoByUser2,
  updateProfileInfo: updateProfileInfo2
};

// src/modules/profile/profile.route.ts
var router6 = express6.Router();
router6.get("/", auth_default("CUSTOMER" /* CUSTOMER */), ProfileController.getProfileInfoByUser);
router6.patch("/", auth_default("CUSTOMER" /* CUSTOMER */), ProfileController.updateProfileInfo);
var profileRouter = router6;

// src/modules/admin/admin.route.ts
import express7 from "express";

// src/modules/admin/admin.service.ts
var getAllUsers = async () => {
  const result = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var getAllOrders = async () => {
  const result = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var toggleBanUser = async (userId) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!existingUser) {
    throw new Error("User not found");
  }
  if (existingUser.role === "ADMIN") {
    throw new Error("Admin users cannot be banned");
  }
  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      isBanned: !existingUser.isBanned
    }
  });
  return result;
};
var getAllReviews = async () => {
  const result = await prisma.review.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var deleteReview = async (deleteId) => {
  const result = await prisma.review.delete({
    where: {
      id: deleteId
    }
  });
  return result;
};
var deleteOrder = async (deleteId) => {
  const result = await prisma.order.delete({
    where: {
      id: deleteId
    }
  });
  return result;
};
var adminService = {
  getAllUsers,
  getAllOrders,
  toggleBanUser,
  getAllReviews,
  deleteReview,
  deleteOrder
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = async (req, res) => {
  try {
    const result = await adminService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users Fetched Successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Users Fetch Failed"
    });
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const result = await adminService.getAllOrders();
    res.status(200).json({
      success: true,
      message: "Orders Fetched Successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Orders Fetch Failed"
    });
  }
};
var toggleBanUser2 = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new Error("User ID is required");
    }
    const result = await adminService.toggleBanUser(userId);
    return res.status(200).json({
      success: true,
      message: result.isBanned ? "User banned successfully" : "User unbanned successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed"
    });
  }
};
var getAllReviews2 = async (req, res) => {
  try {
    const result = await adminService.getAllReviews();
    res.status(200).json({
      success: true,
      message: "Reviews Fetched Successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Reviews Fetch Failed"
    });
  }
};
var deleteReview2 = async (req, res) => {
  try {
    const { deleteId } = req.params;
    const result = await adminService.deleteReview(deleteId);
    res.status(200).json({
      success: true,
      message: "Review Deleted Successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Reviews Deleted Failed"
    });
  }
};
var deleteOrder2 = async (req, res) => {
  try {
    const { deleteId } = req.params;
    const result = await adminService.deleteOrder(deleteId);
    res.status(200).json({
      success: true,
      message: "Review Deleted Successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Reviews Deleted Failed"
    });
  }
};
var adminController = {
  getAllUsers: getAllUsers2,
  getAllOrders: getAllOrders2,
  toggleBanUser: toggleBanUser2,
  getAllReviews: getAllReviews2,
  deleteReview: deleteReview2,
  deleteOrder: deleteOrder2
};

// src/modules/admin/admin.route.ts
var router7 = express7.Router();
router7.get("/users", auth_default("ADMIN" /* ADMIN */), adminController.getAllUsers);
router7.patch("/users/:userId/status", auth_default("ADMIN" /* ADMIN */), adminController.toggleBanUser);
router7.get("/orders", auth_default("ADMIN" /* ADMIN */), adminController.getAllOrders);
router7.get("/reviews", auth_default("ADMIN" /* ADMIN */), adminController.getAllReviews);
router7.delete("/review/:deleteId", auth_default("ADMIN" /* ADMIN */), adminController.deleteReview);
router7.delete("/orders/:deleteId", auth_default("ADMIN" /* ADMIN */), adminController.deleteOrder);
var adminRouter = router7;

// src/modules/review/review.route.ts
import express8 from "express";

// src/modules/review/review.service.ts
var createReview = async (payload, userId) => {
  console.log("Create Review");
  const { medicineId, rating, comment } = payload;
  if (rating < 1 || rating > 5) {
    throw new Error("Rating Must be between 1 to 5 ");
  }
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId }
  });
  if (!medicine) {
    throw new Error("Medicine not found");
  }
  const purchased = await prisma.order.findFirst({
    where: {
      customerId: userId,
      orderItems: {
        some: {
          medicineId
        }
      }
    }
  });
  if (!purchased) {
    throw new Error("You can only review purchased medicines");
  }
  const result = await prisma.review.create({
    data: {
      rating,
      comment: comment ?? null,
      userId,
      medicineId
    }
  });
  return result;
};
var getAllReviews3 = async () => {
  const result = await prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      medicine: {
        select: {
          id: true,
          name: true,
          price: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var updateReview = async (reviewId, userId, data) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId
    }
  });
  if (!review) {
    throw new Error("Review is not found");
  }
  if (review.userId !== userId) {
    throw new Error("You are not authorized to update this review");
  }
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    throw new Error("Rating must be between 1 to 5");
  }
  const result = await prisma.review.update({
    where: {
      id: reviewId
    },
    data
  });
  return result;
};
var deleteReview3 = async (reviewId, userId) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId
    }
  });
  if (!review) {
    throw new Error("Review is not found");
  }
  if (review.userId !== userId) {
    throw new Error("You are not authorized to update this review");
  }
  const result = await prisma.review.delete({
    where: {
      id: reviewId
    }
  });
  return result;
};
var reviewService = {
  createReview,
  getAllReviews: getAllReviews3,
  updateReview,
  deleteReview: deleteReview3
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user?.id) {
      throw new Error("Unauthorized");
    }
    const result = await reviewService.createReview(req.body, user?.id);
    res.status(201).json({
      success: true,
      message: "Review Created Successfully",
      data: result
    });
  } catch (e) {
    res.status(400).json({
      error: "Review Creation Failed",
      details: e,
      message: e.message || "Review Creation Failed"
    });
  }
};
var getAllReviews4 = async (req, res) => {
  try {
    const result = await reviewService.getAllReviews();
    res.status(200).json({
      success: true,
      message: "Review Fetched Successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: "Review Creation Failed",
      details: error,
      message: error.message || "Review Fetched Failed"
    });
  }
};
var updateReview2 = async (req, res) => {
  try {
    const user = req.user;
    const { reviewId } = req.params;
    if (!user?.id) {
      throw new Error("Unauthorized");
    }
    const result = await reviewService.updateReview(reviewId, user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Updated  Successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Update Failed"
    });
  }
};
var deleteReview4 = async (req, res) => {
  try {
    const user = req.user;
    const { reviewId } = req.params;
    if (!user?.id) {
      throw new Error("Unauthorized");
    }
    const result = await reviewService.deleteReview(reviewId, user.id);
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong"
    });
  }
};
var reviewController = {
  createReview: createReview2,
  getAllReviews: getAllReviews4,
  updateReview: updateReview2,
  deleteReview: deleteReview4
};

// src/modules/review/review.route.ts
var router8 = express8.Router();
router8.post("/", auth_default("CUSTOMER" /* CUSTOMER */), reviewController.createReview);
router8.get("/", reviewController.getAllReviews);
router8.patch("/:reviewId", auth_default("CUSTOMER" /* CUSTOMER */), reviewController.updateReview);
router8.delete("/:reviewId", auth_default("CUSTOMER" /* CUSTOMER */), reviewController.deleteReview);
var reviewRouter = router8;

// src/app.ts
var app = express9();
app.use(express9.json());
app.use(cookieParser());
app.use(cors({
  // origin:process.env.APP_URL || "http://localhost:3000",
  origin: process.env.APP_URL,
  credentials: true
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", medicineRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/cart", cartRouter);
app.use("/api/profile", profileRouter);
app.use("/api/admin", adminRouter);
app.use("/api/review", reviewRouter);
app.get("/", (req, res) => {
  res.send("Hello World");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
