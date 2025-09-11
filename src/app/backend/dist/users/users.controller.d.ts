import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: {
        user: {
            userId: string;
        };
    }): Promise<Omit<User, 'password'>>;
    updateProfile(req: {
        user: {
            userId: string;
        };
    }, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>>;
}
