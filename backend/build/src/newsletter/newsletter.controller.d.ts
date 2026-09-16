import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
export declare class NewsletterController {
    private readonly newsletterService;
    constructor(newsletterService: NewsletterService);
    subscribe(dto: SubscribeNewsletterDto): Promise<{
        success: boolean;
        message: string;
        alreadySubscribed?: boolean;
    }>;
}
