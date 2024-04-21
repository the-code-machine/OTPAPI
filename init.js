const { CronJob } = require('cron');
const mongoose = require('mongoose');
const moment = require('moment');
const otpModel = require('./model');

function startCronJobs() {
  const deleteExpiredOtpsJob = new CronJob(
    '*/5 * * * *', // Run every 5 minutes
    async () => {
      try {
        const fiveMinutesAgo = moment().subtract(5, 'minutes').toDate();
        const result = await otpModel.deleteMany({ createdAt: { $lt: fiveMinutesAgo } });

        console.log(`Deleted ${result.deletedCount} expired OTPs`);
      } catch (error) {
        console.error('Error deleting expired OTPs:', error);
      }
    },
    null,
    true, // Start the job immediately
    'Asia/Kolkata' // Time zone for the job
  );

  deleteExpiredOtpsJob.start();
}

module.exports = {
  startCronJobs,
};
