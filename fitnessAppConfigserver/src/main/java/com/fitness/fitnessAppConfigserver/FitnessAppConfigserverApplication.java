package com.fitness.fitnessAppConfigserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class FitnessAppConfigserverApplication {

	public static void main(String[] args) {
		SpringApplication.run(FitnessAppConfigserverApplication.class, args);
	}

}
