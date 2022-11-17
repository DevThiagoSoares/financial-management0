BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Loan] DROP CONSTRAINT [Loan_userId_key];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
