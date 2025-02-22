package raf.rs.nwp_project_kotlin

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@EnableScheduling
@SpringBootApplication
class NwpProjectKotlinApplication

fun main(args: Array<String>) {
	runApplication<NwpProjectKotlinApplication>(*args)
}
