using c__api.Data;
using c__api.Interfaces;
using c__api.Repos;
using c__api.Utils.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddLogging();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//prevent refrance sycal in the db circular refrance
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});

//add db context
builder.Services.AddDbContext<ApplicationDBContext>(option =>
    {
        option.UseSqlServer(builder.Configuration.GetConnectionString("DB_Connection"));
    }
);
//add IExpenseRepository to services
builder.Services.AddScoped<IExpenseRepository, ExpenseRepo>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepo>();



var app = builder.Build();

//seed the defult categories to the db
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDBContext>();
    var configuration = services.GetRequiredService<IConfiguration>();
    var logger = services.GetRequiredService<ILogger<Program>>();
    await SeedCategories.InitializeCategory(context, configuration, logger);
}



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
