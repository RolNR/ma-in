-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'operator', 'client');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDIENTE', 'EN_RUTA', 'EN_PROCESO_ENTREGA', 'ENTREGADO', 'ERRONEA', 'CADUCADA', 'SIN_UTILIZAR');

-- CreateTable
CREATE TABLE "carriers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "carriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "company_name" VARCHAR(200) NOT NULL,
    "rfc" VARCHAR(13),
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "contact_name" VARCHAR(100),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'operator',
    "client_id" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batches" (
    "id" TEXT NOT NULL,
    "client_id" INTEGER,
    "created_by" INTEGER,
    "description" VARCHAR(200),
    "guide_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" TEXT NOT NULL,
    "tracking_code" VARCHAR(20) NOT NULL,
    "carrier_id" INTEGER NOT NULL,
    "client_id" INTEGER,
    "created_by" INTEGER,
    "batch_id" TEXT,
    "guide_type" VARCHAR(20),
    "folio_interno" VARCHAR(50),
    "external_guide_no" VARCHAR(50),
    "sender_name" VARCHAR(200),
    "origin_street" VARCHAR(200),
    "origin_city" VARCHAR(100),
    "origin_state" VARCHAR(100),
    "origin_postal" VARCHAR(10),
    "recipient_name" VARCHAR(200),
    "dest_zone" VARCHAR(100),
    "dest_abbr" VARCHAR(10),
    "dest_street" VARCHAR(200),
    "dest_city" VARCHAR(100),
    "dest_state" VARCHAR(100),
    "dest_postal" VARCHAR(10),
    "content" VARCHAR(200),
    "weight" DECIMAL(8,2),
    "overweight" DECIMAL(8,2),
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDIENTE',
    "received_by" VARCHAR(200),
    "carrier_metadata" JSONB,
    "shipment_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_events" (
    "id" SERIAL NOT NULL,
    "shipment_id" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "location" VARCHAR(100),
    "updated_by" INTEGER,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipment_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_evidence" (
    "id" SERIAL NOT NULL,
    "shipment_id" TEXT NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipment_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "csv_imports" (
    "id" SERIAL NOT NULL,
    "carrier_id" INTEGER NOT NULL,
    "imported_by" INTEGER NOT NULL,
    "filename" VARCHAR(200) NOT NULL,
    "total_rows" INTEGER NOT NULL DEFAULT 0,
    "ok_rows" INTEGER NOT NULL DEFAULT 0,
    "error_rows" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL,
    "errors" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "csv_imports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carriers_code_key" ON "carriers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_tracking_code_key" ON "shipments"("tracking_code");

-- CreateIndex
CREATE INDEX "shipments_tracking_code_idx" ON "shipments"("tracking_code");

-- CreateIndex
CREATE INDEX "shipments_client_id_idx" ON "shipments"("client_id");

-- CreateIndex
CREATE INDEX "shipments_status_idx" ON "shipments"("status");

-- CreateIndex
CREATE INDEX "shipments_shipment_date_idx" ON "shipments"("shipment_date");

-- CreateIndex
CREATE INDEX "shipment_events_shipment_id_idx" ON "shipment_events"("shipment_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_carrier_id_fkey" FOREIGN KEY ("carrier_id") REFERENCES "carriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_events" ADD CONSTRAINT "shipment_events_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_events" ADD CONSTRAINT "shipment_events_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_evidence" ADD CONSTRAINT "shipment_evidence_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "csv_imports" ADD CONSTRAINT "csv_imports_carrier_id_fkey" FOREIGN KEY ("carrier_id") REFERENCES "carriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "csv_imports" ADD CONSTRAINT "csv_imports_imported_by_fkey" FOREIGN KEY ("imported_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
