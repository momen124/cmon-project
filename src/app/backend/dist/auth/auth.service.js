"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const email_service_1 = require("../email/email.service");
const password_reset_token_entity_1 = require("../entities/password-reset-token.entity");
let AuthService = class AuthService {
    usersService;
    jwtService;
    emailService;
    passwordResetTokenRepository;
    constructor(usersService, jwtService, emailService, passwordResetTokenRepository) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findOne(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(createUserDto) {
        const { email, password, name } = createUserDto;
        const existingUser = await this.usersService.findOne(email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.usersService.create({
            email,
            password: hashedPassword,
            name,
        });
        await this.emailService.sendMail(user.email, 'Welcome to Our App!', `Hello ${user.name}, welcome to our application!`);
        const { password: _, ...result } = user;
        return result;
    }
    async forgotPassword(email) {
        const user = await this.usersService.findOne(email);
        if (!user) {
            return { message: 'If a user with this email exists, a password reset link has been sent.' };
        }
        const existingToken = await this.passwordResetTokenRepository.findOne({ where: { user: { id: user.id } } });
        if (existingToken) {
            await this.passwordResetTokenRepository.remove(existingToken);
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expires_at = new Date();
        expires_at.setHours(expires_at.getHours() + 1);
        const resetToken = this.passwordResetTokenRepository.create({
            user,
            token,
            expires_at,
        });
        await this.passwordResetTokenRepository.save(resetToken);
        await this.emailService.sendMail(user.email, 'Password Reset Request', `Here is your password reset token: ${token}`);
        return { message: 'If a user with this email exists, a password reset link has been sent.' };
    }
    async resetPassword(token, newPassword) {
        const resetToken = await this.passwordResetTokenRepository.findOne({ where: { token }, relations: ['user'] });
        if (!resetToken || resetToken.expires_at < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired password reset token');
        }
        const { user } = resetToken;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersService.update(user.id, { password: hashedPassword });
        await this.passwordResetTokenRepository.remove(resetToken);
        return { message: 'Password has been reset successfully.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(password_reset_token_entity_1.PasswordResetToken)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map