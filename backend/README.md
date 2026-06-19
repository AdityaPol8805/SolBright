# BrightSol Advisor Backend

A Node.js Express API server for the BrightSol Advisor solar energy calculator and management system.

## Features

### 🌞 MNRE Solar Rooftop Subsidy API
- Fetches official MNRE subsidy data from government PDF
- Parses and structures subsidy rates and eligibility criteria
- Calculates applicable subsidies based on system capacity
- Intelligent caching with fallback data support

### ⚡ Solar System Calculator API
- Comprehensive solar system sizing calculations
- Cost analysis with MNRE subsidy integration
- Payback period and ROI calculations
- Environmental impact assessment (CO2 reduction)
- Location-based solar irradiation data for Indian states

### 🔒 Production Ready Features
- Security middleware (Helmet, CORS, Rate limiting)
- Request compression and logging
- Error handling and validation
- API documentation and health checks
- Caching for performance optimization

## API Endpoints

### Health & Status
```
GET /health                    # API health check
GET /api/mnre/cache-status    # Cache status and statistics
POST /api/mnre/clear-cache    # Clear API cache
```

### MNRE Subsidy Data
```
GET /api/mnre/subsidy-data    # Fetch complete MNRE subsidy information
GET /api/mnre/subsidy-rates   # Calculate subsidy for specific capacity
```

### Solar Calculations
```
POST /api/solar/calculate     # Calculate solar system requirements
GET /api/solar/locations      # Get solar irradiation data by location
```

## Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server:**
```bash
npm run dev
```

5. **Start production server:**
```bash
npm start
```

The API will be available at `http://localhost:3001`

## API Usage Examples

### Get MNRE Subsidy Data
```bash
curl http://localhost:3001/api/mnre/subsidy-data
```

### Calculate Subsidy for Specific Capacity
```bash
curl "http://localhost:3001/api/mnre/subsidy-rates?capacity=5&category=residential"
```

### Calculate Solar System
```bash
curl -X POST http://localhost:3001/api/solar/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "monthlyBill": 3000,
    "location": "Maharashtra",
    "roofArea": 100,
    "roofType": "concrete",
    "shadingFactor": 0.85,
    "electricityRate": 6,
    "systemType": "grid-tied"
  }'
```

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "lastUpdated": "2024-01-20T10:30:00Z"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## MNRE Data Integration

The API integrates with official MNRE (Ministry of New and Renewable Energy) data:

- **Primary Source:** https://api.solarrooftop.gov.in/pdf/revised_CFA_structure_08052023.pdf
- **Fallback Data:** Structured subsidy information based on latest MNRE guidelines
- **Auto-Update:** PDF data is fetched and cached hourly
- **Offline Support:** Fallback to cached data when PDF is unavailable

### Subsidy Calculation Logic

**Residential Category:**
- First 3 kW: ₹14,588 per kW
- Next 7 kW (3-10 kW): ₹7,294 per kW
- Maximum subsidy: ₹94,822 (for 10 kW system)

**Institutional Category:**
- Up to 500 kW: ₹9,000 per kW (approximate)

## Solar Calculator Features

### System Sizing
- Calculates optimal system size based on electricity consumption
- Considers location-specific solar irradiation
- Accounts for shading and system efficiency factors
- Validates roof area requirements

### Financial Analysis
- System cost estimation with market rates
- MNRE subsidy calculation and deduction
- Annual savings projection
- Payback period analysis
- Return on investment calculations

### Environmental Impact
- Annual CO2 emission reduction
- Equivalent tree planting impact
- Environmental benefits quantification

## Caching Strategy

- **MNRE Data:** 1-hour TTL (Time To Live)
- **Solar Calculations:** 5-minute TTL for repeated calculations
- **Cache Keys:** Structured for efficient retrieval
- **Fallback Mechanism:** Automatic fallback to stored data on API failures

## Error Handling

The API implements comprehensive error handling:

- **Validation Errors:** Input parameter validation
- **Network Errors:** Timeout and connection error handling
- **PDF Parse Errors:** Fallback to structured data
- **Rate Limiting:** Protection against API abuse
- **Global Error Handler:** Consistent error response format

## Security Features

- **Helmet:** Security headers protection
- **CORS:** Cross-origin request handling
- **Rate Limiting:** 100 requests per 15-minute window
- **Input Validation:** Request parameter sanitization
- **Error Sanitization:** Prevents sensitive information leaks

## Development

### Project Structure
```
backend/
├── server.js              # Main server file
├── routes/
│   ├── mnre.js           # MNRE subsidy API routes
│   └── solar.js          # Solar calculation routes
├── package.json          # Dependencies and scripts
├── .env                  # Environment configuration
└── README.md            # This file
```

### Adding New Features

1. Create new route files in `/routes/`
2. Add route imports to `server.js`
3. Update API documentation
4. Add appropriate error handling and validation

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `MNRE_PDF_URL` | MNRE PDF source URL | Official MNRE URL |
| `CACHE_TTL` | Cache time-to-live in seconds | 3600 |

## Deployment

### Production Deployment

1. **Set environment to production:**
```bash
export NODE_ENV=production
```

2. **Install production dependencies:**
```bash
npm install --only=production
```

3. **Start with process manager:**
```bash
pm2 start server.js --name "brightsol-api"
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

## Monitoring

### Health Check
```bash
curl http://localhost:3001/health
```

### Cache Statistics
```bash
curl http://localhost:3001/api/mnre/cache-status
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please create an issue in the GitHub repository.

---

**Built for BrightSol Advisor** - Empowering solar energy adoption in India 🌞