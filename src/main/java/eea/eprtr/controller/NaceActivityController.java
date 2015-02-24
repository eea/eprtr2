package eea.eprtr.controller;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.NaceActivityRepository;
import eea.eprtr.model.NaceActivity;

@RestController
public class NaceActivityController {

	private NaceActivityRepository repository;
	
	@PersistenceContext
    private EntityManager em;

	@Autowired
	public NaceActivityController(NaceActivityRepository repository) {
		this.repository = repository;
	}

	@RequestMapping("/naceActivity")
	public List<NaceActivity> list(
			@RequestParam(value = "ParentID", required = false) Integer parentID,
			@RequestParam(value = "NaceActivityCode", required = false) String naceActivityCode) {
			return repository.list(parentID, naceActivityCode);
		}

	@RequestMapping("/naceActivity/{naceCode}")
	public NaceActivity get(
		@PathVariable(value = "naceCode") String naceCode) {
			return repository.get(naceCode);
	}
}
