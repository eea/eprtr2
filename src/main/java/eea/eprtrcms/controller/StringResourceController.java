package eea.eprtrcms.controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtrcms.dao.StringResourceFilter;
import eea.eprtrcms.dao.StringResourceRepository;
import eea.eprtrcms.model.StringResource;

@RestController
public class StringResourceController {

	@Autowired
	private StringResourceRepository stringResourceRepository;

	
	@RequestMapping("/eprtrresource")
    public List<StringResource> pollutantreleaseSearch(
    		
    		@RequestParam(value = "ResourceType", required = false) String resourceType,
    		@RequestParam(value = "CultureCode", required = false) String cultureCode,
    		@RequestParam(value = "ResourceKey", required = false) String resourceKey,
    		HttpServletResponse response
    		) {
		
		StringResourceFilter stringResourceFilter = new StringResourceFilter(resourceType, cultureCode, resourceKey);

		List<StringResource> stringResources = stringResourceRepository.getStringResources(stringResourceFilter);
		
		return stringResources;
	
	}
}	