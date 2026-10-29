import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './common/payments/payments.module';
import configuration from './config/configuration';
import { StorageModule } from './common/storage/storage.module';
import { DatabaseModule } from './database/database.module';
import { AnnualReportsModule } from './modules/annual-reports/annual-reports.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogCategoriesModule } from './modules/blog-categories/blog-categories.module';
import { BlogsAndStoriesModule } from './modules/blogs-and-stories/blogs-and-stories.module';
import { DonorsModule } from './modules/donors/donors.module';
import { LeadsContactModule } from './modules/leads-contact/leads-contact.module';
import { LeadsVolunteerModule } from './modules/leads-volunteer/leads-volunteer.module';
import { OrganizationalDocumentsModule } from './modules/organizational-documents/organizational-documents.module';
import { PrivacyPolicyModule } from './modules/privacy-policy/privacy-policy.module';
import { TermsAndConditionsModule } from './modules/terms-and-conditions/terms-and-conditions.module';
import { PartnershipInquiriesModule } from './modules/partnership-inquiries/partnership-inquiries.module';
import { MilestonesModule } from './modules/milestones/milestones.module';
import { LeadershipMembersModule } from './modules/leadership-members/leadership-members.module';
import { ImpactStatsModule } from './modules/impact-stats/impact-stats.module';
import { ImpactCategoriesModule } from './modules/impact-categories/impact-categories.module';
import { ImpactInitiativesModule } from './modules/impact-initiatives/impact-initiatives.module';
import { NewsletterSubscribersModule } from './modules/newsletter-subscribers/newsletter-subscribers.module';
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
    OrganizationalDocumentsModule,
    AnnualReportsModule,
    PartnershipInquiriesModule,
    MilestonesModule,
    BlogCategoriesModule,
    BlogsAndStoriesModule,
    LeadershipMembersModule,
    ImpactStatsModule,
    ImpactCategoriesModule,
    ImpactInitiativesModule,
    NewsletterSubscribersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
