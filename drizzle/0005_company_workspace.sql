ALTER TABLE `prolineWorkspaceSettings` ADD `companyId` varchar(80) NOT NULL DEFAULT 'default';
CREATE INDEX `prolineWorkspaceSettings_companyId_idx` ON `prolineWorkspaceSettings` (`companyId`);
ALTER TABLE `prolineOrders` ADD `companyId` varchar(80) NOT NULL DEFAULT 'default';
CREATE INDEX `prolineOrders_companyId_idx` ON `prolineOrders` (`companyId`);
ALTER TABLE `prolineNotifications` ADD `companyId` varchar(80) NOT NULL DEFAULT 'default';
CREATE INDEX `prolineNotifications_companyId_idx` ON `prolineNotifications` (`companyId`);
