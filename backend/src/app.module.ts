import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './common/payments/payments.module';
import configuration from './config/configuration';
import { StorageModule } from './common/storage/storage.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { DonorsModule } from './modules/donors/donors.module';
import { LeadsContactModule } from './modules/leads-contact/leads-contact.module';
import { LeadsVolunteerModule } from './modules/leads-volunteer/leads-volunteer.module';
import { PrivacyPolicyModule } from './modules/privacy-policy/privacy-policy.module';
import { TermsAndConditionsModule } from './modules/terms-and-conditions/terms-and-conditions.module';
import { PartnershipInquiriesModule } from './modules/partnership-inquiries/partnership-inquiries.module';
import { MilestonesModule } from './modules/milestones/milestones.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    DatabaseModule,
    StorageModule,
    PaymentsModule,
    AuthModule,
    UsersModule,
    DonorsModule,
    LeadsContactModule,
    LeadsVolunteerModule,
    TermsAndConditionsModule,
    PrivacyPolicyModule,
    PartnershipInquiriesModule,
    MilestonesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
