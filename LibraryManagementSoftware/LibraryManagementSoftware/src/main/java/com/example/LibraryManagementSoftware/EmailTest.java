package com.example.LibraryManagementSoftware;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class EmailTest {
    public static void main(String[] args) {
        SpringApplication.run(EmailTest.class, args);
    }
}

@Component
class EmailTestRunner implements CommandLineRunner {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void run(String... args) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("nukalaharshini358@gmail.com"); // 👉 replace with your email
            message.setSubject("✅ Test Email from Spring Boot");
            message.setText("If you received this, Gmail SMTP is working fine!");

            mailSender.send(message);
            System.out.println("✅ Email sent successfully!");
        } catch (Exception e) {
            System.out.println("❌ Error sending email:");
            e.printStackTrace();
        }
    }
}
