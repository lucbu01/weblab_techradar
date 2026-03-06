import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TechnologyApi } from './technology-api';
import {
  CreateTechnology,
  Technology,
  UpdateTechnology,
} from '@techradar/libs';

describe('TechnologyApi', () => {
  let service: TechnologyApi;
  let httpMock: HttpTestingController;
  const apiUrl = '/api/technologies';

  const mockTechnologies: Technology[] = [
    {
      id: '1',
      name: 'Angular',
      category: 'LANGS_FRAMEWORKS',
      ring: 'ADOPT',
      published: true,
      description: 'Web Framework',
      classificationDescription: 'Safe to use',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'React',
      category: 'LANGS_FRAMEWORKS',
      ring: 'TRIAL',
      published: false,
      description: 'UI Library',
      classificationDescription: 'Testing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TechnologyApi],
    });
    service = TestBed.inject(TechnologyApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTechnologies', () => {
    it('should fetch all technologies without params', () => {
      service.getTechnologies().subscribe((techs) => {
        expect(techs).toEqual(mockTechnologies);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(mockTechnologies);
    });

    it('should fetch technologies with filters', () => {
      service
        .getTechnologies(true, 'Angular', 'LANGS_FRAMEWORKS', 'ADOPT')
        .subscribe();

      const req = httpMock.expectOne((r) => r.url === apiUrl);
      expect(req.request.params.get('published')).toBe('true');
      expect(req.request.params.get('name')).toBe('Angular');
      expect(req.request.params.get('category')).toBe('LANGS_FRAMEWORKS');
      expect(req.request.params.get('ring')).toBe('ADOPT');
      req.flush(mockTechnologies);
    });
  });

  it('should get technology by id', () => {
    const id = '1';
    service.getTechnologyById(id).subscribe((tech) => {
      expect(tech).toEqual(mockTechnologies[0]);
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTechnologies[0]);
  });

  it('should create a technology', () => {
    const newTech: CreateTechnology = {
      name: 'Vue',
      category: 'LANGS_FRAMEWORKS',
      description: 'Another framework',
      published: false,
    };
    service.createTechnology(newTech).subscribe((tech) => {
      expect(tech.name).toBe('Vue');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTech);
    req.flush({
      ...newTech,
      id: '3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  it('should update a technology', () => {
    const id = '1';
    const update: UpdateTechnology = {
      name: 'Angular Updated',
      category: 'LANGS_FRAMEWORKS',
      description: 'Updated description',
    };
    service.updateTechnology(id, update).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(update);
    req.flush({});
  });

  it('should delete a technology', () => {
    const id = '1';
    service.deleteTechnology(id).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
