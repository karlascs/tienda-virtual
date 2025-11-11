/*
  Warnings:

  - Added the required column `shippingRegion` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Made the column `shippingPhone` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sku` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "isGuest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shippingRegion" TEXT NOT NULL,
ADD COLUMN     "shippingRut" TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "shippingPhone" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "sku" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
