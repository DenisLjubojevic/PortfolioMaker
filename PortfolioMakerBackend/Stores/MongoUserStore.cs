using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PortfolioMakerBackend.Models;

namespace PortfolioMakerBackend.Stores
{
    public class MongoUserStore: IUserStore<User>, IUserEmailStore<User>, IUserPasswordStore<User>, IUserRoleStore<User>
    {
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<IdentityRole> _roles;

        public MongoUserStore(IMongoClient mongoClient, IOptions<MongoDBSettings> mongoSettings)
        {
            var database = mongoClient.GetDatabase(mongoSettings.Value.DatabaseName);
            _users = database.GetCollection<User>("Users");
            System.Diagnostics.Debug.WriteLine($"Users: {_users}");
            _roles = database.GetCollection<IdentityRole>("Roles");
            System.Diagnostics.Debug.WriteLine($"Roles: {_roles}");
        }

        public Task<IdentityResult> CreateAsync(User user, CancellationToken cancellationToken)
        {
            try
            {
                System.Diagnostics.Debug.WriteLine($"Creating user with email: {user.EmailAddress}");
                _users.InsertOne(user);
                System.Diagnostics.Debug.WriteLine($"User created: {user.Id}");
                return Task.FromResult(IdentityResult.Success);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating user: {ex.Message}");
                throw;
            }
        }


        public Task<IdentityResult> UpdateAsync(User user, CancellationToken cancellationToken)
        {
            _users.ReplaceOne(u => u.Id == user.Id, user);
            return Task.FromResult(IdentityResult.Success);
        }

        public Task<IdentityResult> DeleteAsync(User user, CancellationToken cancellationToken)
        {
            _users.DeleteOne(u => u.Id == user.Id);
            return Task.FromResult(IdentityResult.Success);
        }

        public Task<User> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            var user = _users.Find(u => u.Id == userId).FirstOrDefault();
            return Task.FromResult(user);
        }

        public Task<User> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            var user = _users.Find(u => u.NormalizedUserName == normalizedUserName).FirstOrDefault();
            return Task.FromResult(user);
        }

        public Task<string> GetPasswordHashAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash);
        }

        public Task<bool> HasPasswordAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash != null);
        }

        public Task SetPasswordHashAsync(User user, string passwordHash, CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash;
            _users.ReplaceOne(u => u.Id == user.Id, user);
            return Task.CompletedTask;
        }

        public Task<string> GetUserIdAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Id);
        }

        public Task<string?> GetUserNameAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }

        public Task SetUserNameAsync(User user, string? userName, CancellationToken cancellationToken)
        {
            user.UserName = userName;
            _users.ReplaceOne(u => u.Id == user.Id, user);
            return Task.CompletedTask;
        }

        public Task<string?> GetNormalizedUserNameAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedUserName);
        }

        public Task SetNormalizedUserNameAsync(User user, string? normalizedName, CancellationToken cancellationToken)
        {
            user.NormalizedUserName = normalizedName;
            _users.ReplaceOne(u => u.Id == user.Id, user);
            return Task.CompletedTask;
        }

        public async Task AddToRoleAsync(User user, string roleName, CancellationToken cancellationToken)
        {
            string normalizedRoleName = roleName.ToUpper();


            var role = await _roles.Find(r => r.NormalizedName == normalizedRoleName).FirstOrDefaultAsync(cancellationToken);

            if (role == null)
            {
                role = await _roles.Find(r => r.Name.Equals(roleName, StringComparison.OrdinalIgnoreCase))
                                   .FirstOrDefaultAsync(cancellationToken);
            }

            if (role == null) throw new Exception($"Role '{roleName}' not found.");

            user.Roles.Add(roleName);
            await _users.ReplaceOneAsync(u => u.Id == user.Id, user, cancellationToken: cancellationToken);
        }

        public async Task<IList<string>> GetRolesAsync(User user, CancellationToken cancellationToken)
        {
            return user.Roles;
        }

        public async Task<bool> IsInRoleAsync(User user, string roleName, CancellationToken cancellationToken)
        {
            return user.Roles.Contains(roleName);
        }

        public async Task RemoveFromRoleAsync(User user, string roleName, CancellationToken cancellationToken)
        {
            user.Roles.Remove(roleName);
            await _users.ReplaceOneAsync(u => u.Id == user.Id, user, cancellationToken: cancellationToken);
        }

        public async Task<IList<User>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var users = await _users
                .Find(u => u.Roles.Contains(roleName))
                .ToListAsync(cancellationToken);

            return users;
        }

        public async Task<string> GetEmailAsync(User user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            return user.EmailAddress;
        }

        public async Task<bool> GetEmailConfirmedAsync(User user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            return user.EmailConfirmed;
        }

        public Task SetEmailConfirmedAsync(User user, bool confirmed, CancellationToken cancellationToken)
        {
            user.EmailConfirmed = confirmed;
            return Task.CompletedTask;
        }

        public async Task<User> FindByEmailAsync(string email, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            return await _users.Find(u => u.EmailAddress == email).FirstOrDefaultAsync(cancellationToken);
        }

        public Task<string> GetNormalizedEmailAsync(User user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            return Task.FromResult(user.EmailAddress.ToUpper());
        }

        public Task SetNormalizedEmailAsync(User user, string normalizedEmail, CancellationToken cancellationToken)
        {
            user.EmailAddress = normalizedEmail;
            return Task.CompletedTask;
        }

        public Task SetEmailAsync(User user, string email, CancellationToken cancellationToken)
        {
            user.EmailAddress = email;
            return Task.CompletedTask;
        }
        public void Dispose()
        {
            // No resources to dispose of at this moment
        }
    }
}
