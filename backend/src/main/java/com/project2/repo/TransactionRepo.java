package com.project2.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project2.model.Transaction;
public interface TransactionRepo extends JpaRepository<Transaction, Long>{
	List<Transaction> findByStatus(String status);
}