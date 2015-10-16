package eea.eprtrcms.controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtrcms.dao.StringResourceFilter;
import eea.eprtrcms.dao.StringResourceRepository;
import eea.eprtrcms.model.CmsResource;

@RestController
public class StringResourceController {

	@Autowired
	private StringResourceRepository stringResourceRepository;

	
	@RequestMapping("/eprtrresource")
    public List<CmsResource> pollutantreleaseSearch(
    		
    		@RequestParam(value = "Type", required = false) String resourceType,
    		@RequestParam(value = "i18n", required = false) String cultureCode,
    		@RequestParam(value = "Key", required = false) String resourceKey,
    		HttpServletResponse response
    		) {
		
		StringResourceFilter stringResourceFilter = new StringResourceFilter(resourceType, cultureCode, resourceKey);

		List<CmsResource> stringResources = stringResourceRepository.getStringResources(stringResourceFilter);
		
		return stringResources;
	
	}
}	