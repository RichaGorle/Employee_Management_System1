package com.employeemanagement.employee_management_system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.employeemanagement.employee_management_system.entity.Employee;
import com.employeemanagement.employee_management_system.service.EmployeeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class EmployeeController {

	@Autowired
	private EmployeeService employeeService;

	@PostMapping
	public ResponseEntity<String> addEmployee(@Valid @RequestBody Employee employee) {
		String msg = employeeService.addEmployee(employee);
		return new ResponseEntity<>(msg, HttpStatus.CREATED);

	}

	@GetMapping("/{id}")
	public ResponseEntity<Employee> getEmployeeById(@PathVariable int id) {
		Employee employee = employeeService.getEmployeeById(id);
		return new ResponseEntity<>(employee, HttpStatus.OK);
	}

	@GetMapping
	public ResponseEntity<List<Employee>> getAllEmployees() {
		List<Employee> employees = employeeService.getAllEmployees();
		return new ResponseEntity<>(employees, HttpStatus.OK);
	}

	@PutMapping("/{id}")
	public ResponseEntity<String> updateEmployee(@PathVariable int id, @Valid @RequestBody Employee updatedEmployee) {
		String response = employeeService.updateEmployee(id, updatedEmployee);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteEmployee(@PathVariable int id) {
		String response = employeeService.deleteEmployee(id);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

}
