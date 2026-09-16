ALTER TABLE `prolineWorkspaceSettings` ADD `companyId` varchar(80) NOT NULL DEFAULT 'default';
CREATE INDEX `prolineWorkspaceSettings_companyId_idx` ON `prolineWorkspaceSettings` (`companyId`);
