import { signupSchema } from './schema';

describe('signupSchema', () => {
  it('should validate a correct input', () => {
    const result = signupSchema.safeParse({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123',
      termsAndConditions: true,
    });
    expect(result.success).toBe(true);
  });

  it('should fail with an empty name', () => {
    const result = signupSchema.safeParse({
      name: '',
      email: 'john.doe@example.com',
      password: 'Password123',
      termsAndConditions: true,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Please enter your name.');
  });

  it('should fail with a whitespace-only name', () => {
    const result = signupSchema.safeParse({
      name: '   ',
      email: 'john.doe@example.com',
      password: 'Password123',
      termsAndConditions: true,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Please enter your name.');
  });

  it('should fail with an invalid email', () => {
    const result = signupSchema.safeParse({
      name: 'John Doe',
      email: 'invalid-email',
      password: 'Password123',
      termsAndConditions: true,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Please enter a valid email address.');
  });

  it('should fail with an empty email', () => {
    const result = signupSchema.safeParse({
      name: 'John Doe',
      email: '',
      password: 'Password123',
      termsAndConditions: true,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Please enter a valid email address.');
  });

  it('should fail with a password shorter than 8 characters', () => {
    const result = signupSchema.safeParse({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Pass123',
      termsAndConditions: true,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Password must be at least 8 characters.');
  });

  it('should fail with a password missing a lowercase letter', () => {
    const result = signupSchema.safeParse({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'PASSWORD123',
      termsAndConditions: true,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Password must contain at least one lowercase letter.');
  });

  it('should fail with a password missing an uppercase letter', () => {
    const result = signupSchema.safeParse({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      termsAndConditions: true,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Password must contain at least one uppercase letter.');
  });

  it('should fail with a password missing a number', () => {
    const result = signupSchema.safeParse({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'PasswordABC',
      termsAndConditions: true,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Password must contain at least one number.');
  });

  it('should fail when terms and conditions are not accepted', () => {
    const result = signupSchema.safeParse({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123',
      termsAndConditions: false,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Please accept the terms and conditions to continue.');
  });

  it('should trim name and email fields', () => {
    const result = signupSchema.safeParse({
      name: '  John Doe  ',
      email: '  john.doe@example.com  ',
      password: 'Password123',
      termsAndConditions: true,
    });
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('John Doe');
    expect(result.data?.email).toBe('john.doe@example.com');
  });
});
