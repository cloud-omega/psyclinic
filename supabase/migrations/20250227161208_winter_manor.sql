-- Seed data for development environment

-- Admin user
INSERT INTO users (id, name, email, password, role)
VALUES (
  UUID(),
  'Admin User',
  'admin@psychcare.com',
  '$2a$10$JrqnVOdJxpNxm1cjlJMQpOu4MAcFIBn.nfZUwm2nNsM5CUAKIvsEK', -- password: admin123
  'admin'
);

-- Psychologists
INSERT INTO users (id, name, email, password, role, profile_picture)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Dr. Sarah Johnson',
  'sarah.johnson@psychcare.com',
  '$2a$10$JrqnVOdJxpNxm1cjlJMQpOu4MAcFIBn.nfZUwm2nNsM5CUAKIvsEK', -- password: admin123
  'psychologist',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
);

INSERT INTO users (id, name, email, password, role, profile_picture)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Dr. Michael Chen',
  'michael.chen@psychcare.com',
  '$2a$10$JrqnVOdJxpNxm1cjlJMQpOu4MAcFIBn.nfZUwm2nNsM5CUAKIvsEK', -- password: admin123
  'psychologist',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
);

-- Psychologist profiles
INSERT INTO psychologist_profiles (id, user_id, specialization, bio, hourly_rate, education, certifications)
VALUES (
  UUID(),
  '11111111-1111-1111-1111-111111111111',
  'Cognitive Behavioral Therapy',
  'Dr. Sarah Johnson is a licensed clinical psychologist with over 10 years of experience in treating anxiety, depression, and trauma-related disorders.',
  120.00,
  'Ph.D. in Clinical Psychology, Stanford University\nM.A. in Psychology, UCLA',
  'Licensed Clinical Psychologist\nCertified in EMDR Therapy'
);

INSERT INTO psychologist_profiles (id, user_id, specialization, bio, hourly_rate, education, certifications)
VALUES (
  UUID(),
  '22222222-2222-2222-2222-222222222222',
  'Family Therapy',
  'Dr. Michael Chen specializes in family therapy and relationship counseling, helping families navigate conflicts and improve communication.',
  100.00,
  'Ph.D. in Family Therapy, Columbia University\nM.S. in Marriage and Family Therapy, NYU',
  'Licensed Marriage and Family Therapist\nCertified Gottman Method Couples Therapist'
);

-- Patients
INSERT INTO users (id, name, email, password, role, profile_picture)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Emily Rodriguez',
  'emily.rodriguez@example.com',
  '$2a$10$JrqnVOdJxpNxm1cjlJMQpOu4MAcFIBn.nfZUwm2nNsM5CUAKIvsEK', -- password: admin123
  'patient',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
);

INSERT INTO users (id, name, email, password, role, profile_picture)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'James Wilson',
  'james.wilson@example.com',
  '$2a$10$JrqnVOdJxpNxm1cjlJMQpOu4MAcFIBn.nfZUwm2nNsM5CUAKIvsEK', -- password: admin123
  'patient',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
);

-- Availability
INSERT INTO availability (id, psychologist_id, day_of_week, start_time, end_time, is_recurring)
VALUES (
  UUID(),
  '11111111-1111-1111-1111-111111111111',
  1, -- Monday
  '09:00:00',
  '17:00:00',
  TRUE
);

INSERT INTO availability (id, psychologist_id, day_of_week, start_time, end_time, is_recurring)
VALUES (
  UUID(),
  '11111111-1111-1111-1111-111111111111',
  3, -- Wednesday
  '09:00:00',
  '17:00:00',
  TRUE
);

INSERT INTO availability (id, psychologist_id, day_of_week, start_time, end_time, is_recurring)
VALUES (
  UUID(),
  '22222222-2222-2222-2222-222222222222',
  2, -- Tuesday
  '10:00:00',
  '18:00:00',
  TRUE
);

INSERT INTO availability (id, psychologist_id, day_of_week, start_time, end_time, is_recurring)
VALUES (
  UUID(),
  '22222222-2222-2222-2222-222222222222',
  4, -- Thursday
  '10:00:00',
  '18:00:00',
  TRUE
);

-- Appointments
INSERT INTO appointments (id, psychologist_id, patient_id, start_time, end_time, status, payment_status, notes)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  DATE_ADD(NOW(), INTERVAL 2 DAY),
  DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 1 HOUR),
  'scheduled',
  'pending',
  'Initial consultation'
);

INSERT INTO appointments (id, psychologist_id, patient_id, start_time, end_time, status, payment_status, notes)
VALUES (
  UUID(),
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444444',
  DATE_ADD(NOW(), INTERVAL 3 DAY),
  DATE_ADD(DATE_ADD(NOW(), INTERVAL 3 DAY), INTERVAL 1 HOUR),
  'scheduled',
  'paid',
  'Follow-up session'
);

INSERT INTO appointments (id, psychologist_id, patient_id, start_time, end_time, status, payment_status, notes)
VALUES (
  UUID(),
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  DATE_SUB(NOW(), INTERVAL 7 DAY),
  DATE_SUB(DATE_SUB(NOW(), INTERVAL 7 DAY), INTERVAL -1 HOUR),
  'completed',
  'paid',
  'Completed session'
);

-- Payments
INSERT INTO payments (id, appointment_id, amount, currency, status, payment_method, transaction_id)
VALUES (
  UUID(),
  '55555555-5555-5555-5555-555555555555',
  120.00,
  'USD',
  'pending',
  'mercado_pago',
  NULL
);

-- Messages
INSERT INTO messages (id, sender_id, receiver_id, content, read)
VALUES (
  UUID(),
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  'Hello Emily, I look forward to our session tomorrow. Please let me know if you have any questions.',
  TRUE
);

INSERT INTO messages (id, sender_id, receiver_id, content, read)
VALUES (
  UUID(),
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'Thank you, Dr. Johnson. I will be there on time.',
  FALSE
);