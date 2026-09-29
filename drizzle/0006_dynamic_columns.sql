ALTER TABLE `prolineOrders` MODIFY `columnId` varchar(80) NOT NULL DEFAULT 'orders';
ALTER TABLE `prolineOrders` MODIFY `pendingTo` varchar(80) NULL;
ALTER TABLE `prolineNotifications` MODIFY `fromColumn` varchar(80) NOT NULL;
ALTER TABLE `prolineNotifications` MODIFY `toColumn` varchar(80) NOT NULL;
ALTER TABLE `prolineAuditLogs` MODIFY `fromColumn` varchar(80) NULL;
ALTER TABLE `prolineAuditLogs` MODIFY `toColumn` varchar(80) NULL;

CREATE TABLE `prolineCompanyColumns` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `companyId` varchar(80) NOT NULL,
  `columnId` varchar(80) NOT NULL,
  `label` varchar(120) NOT NULL,
  `detail` varchar(200),
  `color` varchar(20) NOT NULL DEFAULT '#D78A4A',
  `roleId` varchar(80) NOT NULL,
  `roleLabel` varchar(120) NOT NULL,
  `sortOrder` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `prolineCompanyColumns_companyId_columnId_unique` UNIQUE (`companyId`, `columnId`)
);
CREATE INDEX `prolineCompanyColumns_companyId_idx` ON `prolineCompanyColumns` (`companyId`);
