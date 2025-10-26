CREATE TABLE
    IF NOT EXISTS `items` (
        `Item_ID` VARCHAR(20) NOT NULL,
        `Item_Name` VARCHAR(42) COLLATE utf8mb4_general_ci NOT NULL,
        `Item_MarketName` VARCHAR(256) COLLATE utf8mb4_general_ci NOT NULL,
        `Item_ImageLink` TEXT COLLATE utf8mb4_general_ci NOT NULL,
        `Item_SKU` VARCHAR(21) COLLATE utf8mb4_general_ci NOT NULL,
        `Item_UPC` VARCHAR(12) COLLATE utf8mb4_general_ci NOT NULL,
        PRIMARY KEY (`Item_ID`),
        UNIQUE KEY `uniq_sku` (`Item_SKU`),
        UNIQUE KEY `uniq_upc` (`Item_UPC`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
    IF NOT EXISTS `Vendors` (
        `Vendor_ID` VARCHAR(10) NOT NULL,
        `Vendor_Name` VARCHAR(128) NOT NULL,
        `Vendor_Location` VARCHAR(64) NULL,
        `Vendor__ABVR` VARCHAR(3) NOT NULL,
        PRIMARY KEY (`Vendor_ID`),
        UNIQUE KEY `uq_vendor_abvr` (`Vendor__ABVR`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;