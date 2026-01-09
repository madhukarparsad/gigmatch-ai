import { initEscrowCompletionConsumer } from "./kafka/escrow-complete.consumer";
import { initReputationConsumer } from "./kafka/reputation.consumer";

import { initProposalAnalysisJob } from "./ai/proposal-analysis.job";
import { initJobMatchingJob } from "./ai/job-matching.job";
import { initSearchAlertConsumer } from "./kafka/search-alert.consumer";
import { initNotificationPersistConsumer } from "./kafka/notification-persist.consumer";
import { initAuditConsumer } from "./kafka/audit.consumer";
import { initPaymentConsumer } from "./kafka/payment.consumer";
import { initPaymentNotificationConsumer } from "./kafka/payment-notification.consumer";




initPaymentNotificationConsumer();
initPaymentConsumer();
initAuditConsumer();
initNotificationPersistConsumer();
initSearchAlertConsumer();
initJobMatchingJob();
initProposalAnalysisJob();
initReputationConsumer();
initEscrowCompletionConsumer();
